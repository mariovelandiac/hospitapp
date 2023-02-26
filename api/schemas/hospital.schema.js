const Joi = require('joi');

const userId = Joi.string().uuid();
const name = Joi.string();
const address = Joi.string();
const services = Joi.array();
const hospitalId = Joi.string().uuid();

const createHospitalSchema = Joi.object({
  userId: userId.required(),
  name: name.required(),
  address: address.required(),
  services: services.required(),
});

const updateHospitalSchema = Joi.object({
  name: name.optional(),
  address: address.optional(),
  services: services.optional(),
});

const getHospitalSchema = Joi.object({
  hospitalId: hospitalId.required(),
})


module.exports = {
  createHospitalSchema,
  updateHospitalSchema,
  getHospitalSchema
}
