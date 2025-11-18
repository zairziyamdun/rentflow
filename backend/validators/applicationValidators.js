const Joi = require('joi');

const objectId = Joi.string().hex().length(24);

const createApplicationSchema = Joi.object({
  body: Joi.object({
    propertyId: objectId.required(),
    message: Joi.string().allow('', null).optional(),
  }).required(),
});

const updateApplicationSchema = Joi.object({
  body: Joi.object({
    status: Joi.string().valid('pending', 'approved', 'rejected').required(),
  }).required(),
  params: Joi.object({
    id: objectId.required(),
  }).required(),
});

module.exports = {
  createApplicationSchema,
  updateApplicationSchema,
};


