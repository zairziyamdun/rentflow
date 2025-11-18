const dotenv = require('dotenv');

dotenv.config();

function getEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is required`);
  }
  return value;
}

const config = {
  port: process.env.PORT || 5000,
  mongoUri: getEnv('MONGO_URI'),
  jwt: {
    accessSecret: getEnv('JWT_SECRET'),
    refreshSecret: getEnv('JWT_REFRESH_SECRET'),
    accessExpiresIn: '15m',
    refreshExpiresIn: '7d',
  },
};

module.exports = { config, getEnv };


