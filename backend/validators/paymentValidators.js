const Joi = require('joi');

const objectId = Joi.string().hex().length(24);

const createPaymentSchema = Joi.object({
  body: Joi.object({
    leaseId: objectId.required(),
    amount: Joi.number().positive().required(),
    dueDate: Joi.date().iso().required(),
  }).required(),
});

const updatePaymentSchema = Joi.object({
  body: Joi.object({
    amount: Joi.number().positive().optional(),
    dueDate: Joi.date().iso().optional(),
    paid: Joi.boolean().optional(),
  }).min(1).required(),
  params: Joi.object({
    id: objectId.required(),
  }).required(),
});

module.exports = {
  createPaymentSchema,
  updatePaymentSchema,
};


