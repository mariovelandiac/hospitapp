const Joi = require('joi');

const userId = Joi.string().uuid();
const pid = Joi.number().min(4); // personal id con mínimo 4 numeros
const email = Joi.string().email();
const phone = Joi.number().min(7); // número de telefono de mínimo 7 cifras
const password = Joi.string().alphanum().min(7); // la contraseña debe ser alfanumerica y mínimo con 7 caracteres




const createUserSchema = Joi.object({
  pid: pid.required(),
  email: email.required(),
  phone: phone.required(),
  password: password.required(),
});

const updateUserSchema = Joi.object({
  email: email.optional(),
  phone: phone.optional(),
});

const getUserSchema = Joi.object({
  id: userId.required()
});


module.exports = {
  createUserSchema,
  updateUserSchema,
  getUserSchema
}
