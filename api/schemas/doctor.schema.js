const Joi = require('joi');

const userId = Joi.string().uuid();
const name = Joi.string();
const address = Joi.string();
const dateOfBirth = Joi.date();
const gender = Joi.string().max(1); // m: male, f: female, o: other
const speciality = Joi.string(); // una o más especialidades de un médico/médica
const hospitalId = Joi.string().uuid();
const doctorId = Joi.string().uuid();

const createDoctorSchema = Joi.object({
  userId: userId.required(),
  name: name.required(),
  address: address.required(),
  dateOfBirth: dateOfBirth.required(),
  gender: gender.optional(),
  speciality: speciality.required(), // entrada de género opcional, por defecto es null
  hospitalId: hospitalId.required()
});


const updateDoctorSchema = Joi.object({
  name: name.optional(),
  address: address.optional(),
  dateOfBirth: dateOfBirth.optional(),
  gender: gender.optional(),
  speciality: speciality.optional()
});

const getDoctorSchema = Joi.object({
  id: doctorId.required(),
});


module.exports = {
  createDoctorSchema,
  updateDoctorSchema,
  getDoctorSchema
}
