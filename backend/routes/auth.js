const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middlewares/validate');
const { registerSchema, loginSchema, refreshSchema } = require('../validators/authValidators');

// Регистрация
router.post('/register', validate(registerSchema), authController.register);

// Логин
router.post('/login', validate(loginSchema), authController.login);

// Обновление токенов
router.post('/refresh', validate(refreshSchema), authController.refresh);

// Logout (инвалидация refresh через tokenVersion)
router.post('/logout', authMiddleware, authController.logout);

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-passwordHash');
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});


module.exports = router;
