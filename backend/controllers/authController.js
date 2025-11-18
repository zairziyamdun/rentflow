const AuthService = require('../services/AuthService');

async function register(req, res, next) {
  try {
    const user = await AuthService.register(req.body);
    res.status(201).json({ message: 'Пользователь зарегистрирован', user: { id: user._id, name: user.name, role: user.role } });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { user, accessToken, refreshToken } = await AuthService.login(req.body);
    res.status(200).json({
      accessToken,
      refreshToken,
      user: { id: user._id, name: user.name, role: user.role },
    });
  } catch (err) {
    next(err);
  }
}

async function refresh(req, res, next) {
  try {
    const { user, accessToken, refreshToken } = await AuthService.refreshTokens(req.body.refreshToken);
    res.status(200).json({
      accessToken,
      refreshToken,
      user: { id: user._id, name: user.name, role: user.role },
    });
  } catch (err) {
    next(err);
  }
}

async function logout(req, res, next) {
  try {
    await AuthService.logout(req.user.userId);
    res.status(200).json({ message: 'Выход выполнен' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
  refresh,
  logout,
};


