const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const authMiddleware = require('../middleware/authMiddleware');

// 📩 Получить историю сообщений по leaseId (roomId)
router.get('/:roomId', authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({ roomId: req.params.roomId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при получении сообщений' });
  }
});

module.exports = router;
