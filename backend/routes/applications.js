const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Property = require('../models/Property');
const Lease = require('../models/Lease');
const Payment = require('../models/Payment');
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');

// Подать заявку
router.post('/', authMiddleware, requireRole('tenant'), async (req, res) => {
  try {
    const { propertyId } = req.body;

    const existing = await Application.findOne({
      propertyId,
      tenantId: req.user.userId,
    });

    if (existing) return res.status(400).json({ message: 'Заявка уже подана' });

    const application = new Application({
      propertyId,
      tenantId: req.user.userId,
    });

    await application.save();
    res.status(201).json({ message: 'Заявка отправлена' });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при подаче заявки' });
  }
});

//Получить заявки на объекты
router.get('/received', authMiddleware, requireRole('landlord', 'admin'), async (req, res) => {
  try {
    const properties = await Property.find({ ownerId: req.user.userId });
    const propertyIds = properties.map((p) => p._id);

    const applications = await Application.find({
      propertyId: { $in: propertyIds },
    })
      .populate('propertyId')
      .populate('tenantId', 'name email');

    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при получении заявок' });
  }
});

//Одобрение/отклонение заявки
router.put('/:id', authMiddleware, requireRole('landlord', 'admin'), async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ message: 'Заявка не найдена' });

    application.status = status;
    await application.save();

    if (status === 'approved') {
      const property = await Property.findById(application.propertyId);
      if (!property) return res.status(404).json({ message: 'Объект не найден' });

      const now = new Date();
      const startDate = new Date(now);
      const firstPaymentDate = new Date(now);
      firstPaymentDate.setDate(firstPaymentDate.getDate() + 3); 

      const lease = new Lease({
        propertyId: property._id,
        tenantId: application.tenantId,
        startDate,
      });

      await lease.save();

      const months = 3;
      const payments = [];

      for (let i = 0; i < months; i++) {
        const dueDate = new Date(firstPaymentDate);
        dueDate.setMonth(dueDate.getMonth() + i);

        payments.push(new Payment({
          leaseId: lease._id,
          amount: property.price,
          dueDate,
        }));
      }

      const saved = await Payment.insertMany(payments);
      lease.payments = saved.map(p => p._id);
      await lease.save();
      await Property.findByIdAndUpdate(application.propertyId, {
        available: false,
      });
    }

    res.json({ message: `Заявка обновлена: ${status}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка при обновлении заявки' });
  }
});

// Получить все заявки (по пользователю)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const filter = req.user.role === 'tenant'
      ? { tenantId: req.user.userId }
      : req.user.role === 'landlord'
        ? { propertyId: { $in: (await Property.find({ ownerId: req.user.userId })).map(p => p._id) } }
        : {};

    const applications = await Application.find(filter)
      .populate('propertyId')
      .populate('tenantId', 'name email');

    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при получении заявок' });
  }
});

module.exports = router;
