const Joi = require('joi');

const objectId = Joi.string().hex().length(24);

const createPropertySchema = Joi.object({
  body: Joi.object({
    title: Joi.string().min(2).max(100).required(),
    address: Joi.string().min(2).max(255).required(),
    price: Joi.number().positive().required(),
    rooms: Joi.number().integer().min(1).optional(),
    description: Joi.string().allow('', null).optional(),
    type: Joi.string().valid('apartment', 'house', 'room').optional(),
    available: Joi.boolean().optional(),
    images: Joi.array().items(Joi.string().uri()).optional(),
  }).required(),
});

const updatePropertySchema = Joi.object({
  body: Joi.object({
    title: Joi.string().min(2).max(100).optional(),
    address: Joi.string().min(2).max(255).optional(),
    price: Joi.number().positive().optional(),
    rooms: Joi.number().integer().min(1).optional(),
    description: Joi.string().allow('', null).optional(),
    type: Joi.string().valid('apartment', 'house', 'room').optional(),
    available: Joi.boolean().optional(),
    images: Joi.array().items(Joi.string().uri()).optional(),
  }).min(1).required(),
  params: Joi.object({
    id: objectId.required(),
  }).required(),
});

module.exports = {
  createPropertySchema,
  updatePropertySchema,
};


