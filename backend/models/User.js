const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['tenant', 'landlord', 'admin'],
    default: 'tenant',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  deleted: {
  type: Boolean,
  default: false,
},
});

module.exports = mongoose.model('User', userSchema);
