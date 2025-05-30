const mongoose = require('mongoose');

const leaseSchema = new mongoose.Schema({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true,
  },
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
  },
  payments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
  }],
}, { timestamps: true });

module.exports = mongoose.model('Lease', leaseSchema);
