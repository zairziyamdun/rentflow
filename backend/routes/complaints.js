const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');
const validate = require('../middlewares/validate');
const { createComplaintSchema, updateComplaintSchema } = require('../validators/complaintValidators');

// Отправить жалобу (любой пользователь)
router.post('/', authMiddleware, validate(createComplaintSchema), async (req, res) => {
  try {
    const { targetId, targetType, message } = req.body;

    const complaint = new Complaint({
      userId: req.user.userId,
      targetId,
      targetType,
      message,
    });

    await complaint.save();
    res.status(201).json({ message: 'Жалоба отправлена' });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при отправке жалобы' });
  }
});

// Просмотреть свои жалобы (любой пользователь)
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const complaints = await Complaint.find({ userId: req.user.userId })
      .populate('targetId', 'name email')
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при получении ваших жалоб' });
  }
});

// Удалить свою жалобу (любой пользователь)
router.delete('/my/:id', authMiddleware, async (req, res) => {
  try {
    const complaint = await Complaint.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!complaint) return res.status(404).json({ message: 'Жалоба не найдена' });

    res.json({ message: 'Жалоба удалена' });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при удалении жалобы' });
  }
});


// Просмотреть все жалобы (только admin)
router.get('/', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при получении жалоб' });
  }
});

// Обновить статус жалобы (только admin)
router.put('/:id', authMiddleware, requireRole('admin'), validate(updateComplaintSchema), async (req, res) => {
  try {
    const { status } = req.body;

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Жалоба не найдена' });

    complaint.status = status;
    await complaint.save();

    res.json({ message: 'Статус жалобы обновлён' });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при обновлении жалобы' });
  }
});

// Удалить жалобу (только admin)
router.delete('/:id', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Жалоба не найдена' });

    res.json({ message: 'Жалоба удалена' });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при удалении жалобы' });
  }
});

module.exports = router;
