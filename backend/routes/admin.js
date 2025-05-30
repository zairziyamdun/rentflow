const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');

// 📋 Получить всех пользователей
router.get('/users', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при получении пользователей' });
  }
});

// ✏️ Изменить роль пользователя
router.put('/users/:id/role', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const { role } = req.body;

    if (!['tenant', 'landlord', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Недопустимая роль' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Пользователь не найден' });

    user.role = role;
    await user.save();

    res.json({ message: `Роль обновлена на: ${role}` });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при изменении роли' });
  }
});

const Lease = require('../models/Lease');
const Property = require('../models/Property');

router.delete('/users/:id', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const userId = req.params.id;

    // Проверка: у него есть объекты?
    const owns = await Property.exists({ ownerId: userId });
    if (owns) {
      return res.status(400).json({ message: 'Нельзя удалить: пользователь владеет объектами' });
    }

    // Проверка: он арендатор?
    const hasLease = await Lease.exists({ tenantId: userId });
    if (hasLease) {
      return res.status(400).json({ message: 'Нельзя удалить: пользователь участвует в аренде' });
    }

    // Удаление самого пользователя
    await User.findByIdAndDelete(userId);

    res.json({ message: 'Пользователь полностью удалён' });
  } catch (err) {
    console.error('Ошибка при удалении пользователя:', err);
    res.status(500).json({ message: 'Ошибка при удалении пользователя' });
  }
});


// 📋 Получить все объекты с владельцами
router.get('/properties', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const properties = await Property.find().populate('ownerId', 'name email');
    res.json(properties);
  } catch {
    res.status(500).json({ message: 'Ошибка при получении объектов' });
  }
});

// ❌ Удалить объект
router.delete('/properties/:id', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: 'Объект удалён' });
  } catch {
    res.status(500).json({ message: 'Ошибка при удалении объекта' });
  }
});

const Complaint = require('../models/Complaint');

// 📋 Получить все жалобы
router.get('/complaints', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('userId', 'name email')
      .populate({
        path: 'targetId',
        select: 'title address',
        model: 'Property',
      });

    res.json(complaints);
  } catch (err) {
    console.error('Ошибка при получении жалоб:', err);
    res.status(500).json({ message: 'Ошибка при получении жалоб' });
  }
});


// ❌ Удалить жалобу
router.delete('/complaints/:id', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    await Complaint.findByIdAndDelete(req.params.id);
    res.json({ message: 'Жалоба удалена' });
  } catch {
    res.status(500).json({ message: 'Ошибка при удалении жалобы' });
  }
});


module.exports = router;
