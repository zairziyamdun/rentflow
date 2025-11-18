const Property = require('../models/Property');
const Application = require('../models/Application');
const Lease = require('../models/Lease');
const Payment = require('../models/Payment');
const Complaint = require('../models/Complaint');
const Message = require('../models/Message');

async function deleteProperty(propertyId) {
  const property = await Property.findById(propertyId);
  if (!property) {
    const error = new Error('Объект не найден');
    error.statusCode = 404;
    throw error;
  }

  const leases = await Lease.find({ propertyId: property._id }).select('_id');
  const leaseIds = leases.map((l) => l._id.toString());

  await Promise.all([
    Application.deleteMany({ propertyId: property._id }),
    Lease.deleteMany({ propertyId: property._id }),
    Payment.deleteMany({ leaseId: { $in: leaseIds } }),
    Complaint.deleteMany({ targetId: property._id, targetType: 'property' }),
    Message.deleteMany({ roomId: { $in: leaseIds } }),
  ]);

  await property.deleteOne();

  return { message: 'Объект и связанные записи удалены' };
}

module.exports = {
  deleteProperty,
};


