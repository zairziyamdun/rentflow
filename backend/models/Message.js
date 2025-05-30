const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  roomId: {
    type: String, // мы используем leaseId как строку комнаты
    required: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  senderName: {
  type: String,
  required: true,
},

}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
