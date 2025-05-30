const express = require('express');
const router = express.Router();
const Lease = require('../models/Lease');
const Payment = require('../models/Payment');
const Property = require('../models/Property');
const Application = require('../models/Application');
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');

// Создание аренды (после одобрения заявки)
router.post('/', authMiddleware, requireRole('landlord', 'admin'), async (req, res) => {
  try {
    const { propertyId, tenantId, startDate, months } = req.body;

    const property = await Property.findById(propertyId);
    if (!property || property.ownerId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Нет доступа к объекту' });
    }

    // создаем аренду
    const lease = new Lease({
      propertyId,
      tenantId,
      startDate,
    });

    await lease.save();

    // создаем платежи на N месяцев вперёд
    const payments = [];
    for (let i = 0; i < months; i++) {
      const due = new Date(startDate);
      due.setMonth(due.getMonth() + i);
      payments.push(new Payment({
        leaseId: lease._id,
        amount: property.price,
        dueDate: due,
      }));
    }

    const savedPayments = await Payment.insertMany(payments);
    lease.payments = savedPayments.map(p => p._id);
    await lease.save();

    // Обновляем статус заявки
    await Application.updateMany(
      { propertyId, tenantId },
      { $set: { status: 'approved' } }
    );

    res.status(201).json({ lease, payments: savedPayments });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при создании аренды' });
  }
});

// Получить все аренды (по пользователю)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const filter = req.user.role === 'tenant'
      ? { tenantId: req.user.userId }
      : req.user.role === 'landlord'
      ? { propertyId: { $in: await Property.find({ ownerId: req.user.userId }).distinct('_id') } }
      : {};

    const leases = await Lease.find(filter)
      .populate('propertyId')
      .populate('tenantId', 'name email')
      .populate('payments');

    res.json(leases);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при получении аренд' });
  }
});

// аренды объектов, где текущий userId = property.ownerId
router.get('/my', authMiddleware, requireRole('landlord', 'admin'), async (req, res) => {
  try {
    const leases = await Lease.find({ propertyId: { $in: await Property.find({ ownerId: req.user.userId }).distinct('_id') } })
      .populate('propertyId')
      .populate('tenantId', 'name email')
      .populate('payments');

    res.json(leases);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при получении ваших аренд' });
  }
});

// ❌ Отмена аренды (владелец/админ)
router.delete('/:id', authMiddleware, requireRole('landlord', 'admin'), async (req, res) => {
  try {
    const lease = await Lease.findById(req.params.id);
    if (!lease) return res.status(404).json({ message: 'Аренда не найдена' });

    const property = await Property.findById(lease.propertyId);
    if (!property) return res.status(404).json({ message: 'Объект не найден' });

    // Только владелец или админ может отменить
    if (property.ownerId.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Нет доступа к отмене аренды' });
    }

    // Удаляем аренду и платежи
    await Payment.deleteMany({ leaseId: lease._id });
    await lease.deleteOne();

    // Снова делаем объект доступным
    property.available = true;
    await property.save();

    res.json({ message: 'Аренда отменена, объект снова доступен' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка при отмене аренды' });
  }
});

// Все аренды, где участвует текущий пользователь
router.get('/my-chats', authMiddleware, async (req, res) => {
  try {
    const leases = await Lease.find({
      $or: [
        { tenantId: req.user.userId },
        { 'propertyId': { $exists: true } } // мы потом фильтруем на фронте
      ]
    })
      .populate('propertyId', 'title address ownerId')
      .populate('tenantId', 'name email');

    // фильтруем на фронте: landlord sees leases where property.ownerId === me
    res.json(leases);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при получении чатов' });
  }
});




module.exports = router;