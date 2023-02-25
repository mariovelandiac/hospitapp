const Joi = require('joi');

const userId = Joi.string();
const name = Joi.string();
const address = Joi.string();
const dateOfBirth = Joi.date();
const gender = Joi.string().max(1); // m: male, f: female, o: other



const createPatientSchema = Joi.object({
  userId: userId.required(),
  name: name.required(),
  address: address.required(),
  dateOfBirth: dateOfBirth.required(),
  gender: gender.optional() // entrada de género opcional, por defecto es null
});

const updatePatientSchema = Joi.object({
  name: name.optional(),
  address: address.optional(),
  dateOfBirth: dateOfBirth.optional(),
  gender: gender.optional()
});



module.exports = {
  createPatientSchema,
  updatePatientSchema,
}
