const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../config/jwt');

async function register({ name, email, password }) {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error('Email уже используется');
    error.statusCode = 400;
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const user = new User({
    name,
    email,
    passwordHash,
  });

  await user.save();
  return user;
}

async function login({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error('Пользователь не найден');
    error.statusCode = 404;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    const error = new Error('Неверный пароль');
    error.statusCode = 401;
    throw error;
  }

  const payload = {
    userId: user._id,
    name: user.name,
    role: user.role,
    tokenVersion: user.tokenVersion || 0,
  };

  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  return { user, accessToken, refreshToken };
}

async function refreshTokens(refreshToken) {
  const decoded = verifyRefreshToken(refreshToken);
  const user = await User.findById(decoded.userId);
  if (!user) {
    const error = new Error('Пользователь не найден');
    error.statusCode = 404;
    throw error;
  }

  if ((user.tokenVersion || 0) !== decoded.tokenVersion) {
    const error = new Error('Токен недействителен');
    error.statusCode = 401;
    throw error;
  }

  const payload = {
    userId: user._id,
    name: user.name,
    role: user.role,
    tokenVersion: user.tokenVersion || 0,
  };

  const accessToken = signAccessToken(payload);
  const newRefreshToken = signRefreshToken(payload);

  return { user, accessToken, refreshToken: newRefreshToken };
}

async function logout(userId) {
  const user = await User.findById(userId);
  if (!user) return;
  user.tokenVersion = (user.tokenVersion || 0) + 1;
  await user.save();
}

module.exports = {
  register,
  login,
  refreshTokens,
  logout,
};


