const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// Регистрация
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email уже используется' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      passwordHash,
    });

    await newUser.save();

    res.status(201).json({ message: 'Пользователь зарегистрирован' });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Логин
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Пользователь не найден' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ message: 'Неверный пароль' });

    const token = jwt.sign(
    {
        userId: user._id,   // или просто id
        name: user.name,    // ✅ добавь имя
        role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
    );

    res.status(200).json({ token, user: { id: user._id, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-passwordHash');
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});


module.exports = router;
