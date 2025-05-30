require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const existing = await User.findOne({ email: 'admin@rentflow.com' });

    if (existing) {
      console.log('✅ Админ уже существует');
    } else {
      const passwordHash = await bcrypt.hash('admin123', 10);
      const admin = new User({
        name: 'Admin',
        email: 'admin@rentflow.com',
        passwordHash,
        role: 'admin',
      });

      await admin.save();
      console.log('🎉 Админ создан: admin@rentflow.com / admin123');
    }

    mongoose.disconnect();
  } catch (err) {
    console.error('❌ Ошибка при создании админа:', err.message);
    process.exit(1);
  }
}

createAdmin();
