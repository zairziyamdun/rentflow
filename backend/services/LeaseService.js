const Lease = require('../models/Lease');
const Property = require('../models/Property');
const Application = require('../models/Application');
const Payment = require('../models/Payment');

async function createLease({ propertyId, tenantId, landlordId, months, monthlyRent }) {
  const property = await Property.findById(propertyId);
  if (!property) {
    const error = new Error('Объект не найден');
    error.statusCode = 404;
    throw error;
  }

  if (property.ownerId.toString() !== landlordId.toString()) {
    const error = new Error('Нет доступа к объекту');
    error.statusCode = 403;
    throw error;
  }

  if (!property.available) {
    const error = new Error('Объект уже недоступен для аренды');
    error.statusCode = 400;
    throw error;
  }

  if (!months || months < 1) {
    const error = new Error('Количество месяцев аренды должно быть не менее 1');
    error.statusCode = 400;
    throw error;
  }

  const approvedApplication = await Application.findOne({
    propertyId,
    tenantId,
    status: 'approved',
  });

  if (!approvedApplication) {
    const error = new Error('Нет одобренной заявки для этого арендатора и объекта');
    error.statusCode = 400;
    throw error;
  }

  const now = new Date();
  const firstPaymentDueDate = new Date(now);
  firstPaymentDueDate.setDate(firstPaymentDueDate.getDate() + 3);

  const lease = new Lease({
    propertyId,
    tenantId,
    startDate: now,
  });

  await lease.save();

  const payment = new Payment({
    leaseId: lease._id,
    amount: monthlyRent,
    dueDate: firstPaymentDueDate,
  });

  await payment.save();

  lease.payments = [payment._id];
  await lease.save();

  property.available = false;
  await property.save();

  return lease.populate('propertyId').populate('tenantId', 'name email').populate('payments');
}

module.exports = {
  createLease,
};


