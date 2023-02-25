const Joi = require('joi');

const userId = Joi.string();
const name = Joi.string();
const address = Joi.string();
const dateOfBirth = Joi.date();
const gender = Joi.string().max(1); // m: male, f: female, o: other
const speciality = Joi.array(); // una o más especialidades de un médico/médica


const createDoctorSchema = Joi.object({
  userId: userId.required(),
  name: name.required(),
  address: address.required(),
  dateOfBirth: dateOfBirth.required(),
  gender: gender.optional(),
  speciality: speciality.required() // entrada de género opcional, por defecto es null
});

const updateDoctorSchema = Joi.object({
  name: name.optional(),
  address: address.optional(),
  dateOfBirth: dateOfBirth.optional(),
  gender: gender.optional(),
  speciality: speciality.optional()
});

const getDoctorSchema = Joi.object({
  userId: userId.required(),
})



module.exports = {
  createDoctorSchema,
  updateDoctorSchema,
  getDoctorSchema
}
