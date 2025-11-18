const Joi = require('joi');

const objectId = Joi.string().hex().length(24);

const createLeaseSchema = Joi.object({
  body: Joi.object({
    propertyId: objectId.required(),
    tenantId: objectId.required(),
    months: Joi.number().integer().min(1).required(),
    monthlyRent: Joi.number().positive().required(),
  }).required(),
});

const updateLeaseSchema = Joi.object({
  body: Joi.object({
    status: Joi.string().valid('active', 'completed', 'terminated').required(),
  }).required(),
  params: Joi.object({
    id: objectId.required(),
  }).required(),
});

module.exports = {
  createLeaseSchema,
  updateLeaseSchema,
};


