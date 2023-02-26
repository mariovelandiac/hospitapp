const Joi = require("joi");

const email = Joi.string().email();
const password = Joi.string().min(4).max(30).alphanum();
const token = Joi.string();


const getEmailSchema = Joi.object({
  email: email.required()
});

const newPasswordSchema = Joi.object({
  token: token.required(),
  newPassword: password.required()
});

const verifyEmailSchema = Joi.object({
  token: token.required()
});

const loginSchema = Joi.object({
  email: email.required(),
  password: password.required()
})

module.exports = {getEmailSchema, newPasswordSchema, verifyEmailSchema, loginSchema}
