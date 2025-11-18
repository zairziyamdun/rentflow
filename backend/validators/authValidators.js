const Joi = require('joi');

const registerSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(128).required(),
  }).required(),
});

const loginSchema = Joi.object({
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(128).required(),
  }).required(),
});

const refreshSchema = Joi.object({
  body: Joi.object({
    refreshToken: Joi.string().required(),
  }).required(),
});

module.exports = {
  registerSchema,
  loginSchema,
  refreshSchema,
};


