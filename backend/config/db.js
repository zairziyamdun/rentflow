const mongoose = require('mongoose');
const { config } = require('./env');

async function connectDB() {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('✅ Подключено к MongoDB');
  } catch (err) {
    console.error('❌ Ошибка подключения к MongoDB:', err.message);
    process.exit(1);
  }
}

module.exports = { connectDB };


