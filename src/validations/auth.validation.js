const Joi = require('joi');

exports.registerRequestSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  nickname: Joi.string()
    .regex(/^[A-Za-z각-힣\d]{3,10}$/)
    .required(),
  password: Joi.string().min(4).max(16).required(),
  confirm: Joi.string().required(),
});

exports.loginRequestSchema = Joi.object().keys({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

exports.loginResponseSchema = Joi.string().regex(
  /^[\w\d-_]+\.[\w\d-_]+\.[\w\d-_]+$/,
);
