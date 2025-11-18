const Joi = require('joi');

const objectId = Joi.string().hex().length(24);

const createComplaintSchema = Joi.object({
  body: Joi.object({
    targetId: objectId.required(),
    targetType: Joi.string().valid('user', 'property').required(),
    message: Joi.string().min(5).max(1000).required(),
  }).required(),
});

const updateComplaintSchema = Joi.object({
  body: Joi.object({
    status: Joi.string().valid('pending', 'in_review', 'resolved', 'rejected').required(),
  }).required(),
  params: Joi.object({
    id: objectId.required(),
  }).required(),
});

module.exports = {
  createComplaintSchema,
  updateComplaintSchema,
};


