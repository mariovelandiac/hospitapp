const Joi = require('joi');

const id = Joi.number().min(4); // personal id con mínimo 4 numeros
const email = Joi.email();
const phone = Joi.number().min(7); // número de telefono de mínimo 7 cifras
const password = Joi.alphanum().min(7); // la contraseña debe ser alfanumerica y mínimo con 7 caracteres
const role = Joi.string();



const createUserSchema = Joi.object({
  id: id.required(),
  email: email.required(),
  phone: phone.required(),
  password: password.required(),
  role: role.optional() // el rol por defecto es patient, los otros roles permitidos serán validado según autorización asignada
});

const updateUserSchema = Joi.object({
  email: email.optional(),
  phone: phone.optional(),
});

const updatePasswordSchema = Joi.object({
  password: password.required()
});

const getUserSchema = Joi.object({
  id: id.required()
});


module.exports = {
  createUserSchema,
  updateUserSchema,
  getUserSchema,
  updatePasswordSchema
}
