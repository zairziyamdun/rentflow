const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');
const Application = require('../models/Application');
const Lease = require('../models/Lease');
const Payment = require('../models/Payment');
const Complaint = require('../models/Complaint');


// ➕ Создание объекта (только для владельцев)
router.post('/', authMiddleware, requireRole('landlord', 'admin'), async (req, res) => {
  try {
    const property = new Property({
      ...req.body,
      ownerId: req.user.userId,
    });

    const saved = await property.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при создании объекта' });
  }
});

// 📋 Получить список обьектов владельца
router.get('/my', authMiddleware, requireRole('landlord', 'admin'), async (req, res) => {
  try {
    const properties = await Property.find({ ownerId: req.user.userId }).populate('ownerId', 'name email');
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при получении списка ваших объектов' });
  }
});

// 📋 Получить все объекты (фильтрация по параметрам)
router.get('/', async (req, res) => {
  try {
    const { priceMin, priceMax, type } = req.query;

    const filters = {
      available: true,
    };

    if (priceMin || priceMax) {
      filters.price = {};
      if (priceMin) filters.price.$gte = Number(priceMin);
      if (priceMax) filters.price.$lte = Number(priceMax);
    }

    if (type) filters.type = type;

    const properties = await Property.find(filters).populate('ownerId', 'name email');
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при получении списка объектов' });
  }
});

// 📄 Получить один объект
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('ownerId', 'name email');
    if (!property) return res.status(404).json({ message: 'Объект не найден' });
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при получении объекта' });
  }
});

// ✏️ Обновить объект (только владелец)
router.put('/:id', authMiddleware, requireRole('landlord', 'admin'), async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Объект не найден' });

    if (property.ownerId.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Нет доступа для редактирования' });
    }

    Object.assign(property, req.body);
    const updated = await property.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при обновлении объекта' });
  }
});

// ❌ Удалить объект (только владелец или админ)
router.delete('/:id', authMiddleware, requireRole('landlord', 'admin'), async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Объект не найден' });

    if (property.ownerId.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Нет доступа для удаления' });
    }

    await Promise.all([
        Application.deleteMany({ propertyId: property._id }),
        Lease.deleteMany({ propertyId: property._id }),
        Payment.deleteMany({ propertyId: property._id }),
        Complaint.deleteMany({ targetId: property._id, targetType: 'property' }),
    ]);

    await property.deleteOne();

    res.json({ message: 'Объект и связанные записи удалены' });


  } catch (err) {
    res.status(500).json({ message: 'Ошибка при удалении объекта' });
  }
});

module.exports = router;
