const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');

// Оплата платежа (только tenant)
router.post('/:id/pay', authMiddleware, requireRole('tenant'), async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Платёж не найден' });

    if (payment.paid) {
      return res.status(400).json({ message: 'Платёж уже оплачен' });
    }

    payment.paid = true;
    payment.paidAt = new Date();

    await payment.save();
    res.json({ message: 'Платёж выполнен успешно' });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при оплате' });
  }
});



module.exports = router;