const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Нет токена, доступ запрещён' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Сохраняем информацию о пользователе в запросе
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Неверный токен' });
  }
}

module.exports = authMiddleware;
