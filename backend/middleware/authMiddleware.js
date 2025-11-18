const { verifyAccessToken } = require('../config/jwt');
const User = require('../models/User');

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Нет токена, доступ запрещён' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyAccessToken(token);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'Пользователь не найден' });
    }

    if ((user.tokenVersion || 0) !== decoded.tokenVersion) {
      return res.status(401).json({ message: 'Токен недействителен' });
    }

    req.user = decoded; // userId, name, role, tokenVersion
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Неверный или просроченный токен' });
  }
}

module.exports = authMiddleware;
