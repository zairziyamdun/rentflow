const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  leaseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lease',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  paid: {
    type: Boolean,
    default: false,
  },
  paidAt: {
    type: Date,
  },
});

module.exports = mongoose.model('Payment', paymentSchema);
