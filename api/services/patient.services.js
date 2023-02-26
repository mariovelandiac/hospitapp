const boom = require("@hapi/boom"); // librería para gestionar errores
const { models } = require('./../../libs/sequelize'); // modelos del ORM para la DB
const uuid = require('uuid'); // librería para creación de uuid
const fs = require('fs');

// Servicios de usuarios
const UserServices = require('./user.services');
const user = new UserServices();

class PatientServices {
  constructor() {};

  async create(data) {
    const patientId = uuid.v4(); // creación de patientId
    await user.findOne(data.userId); // validación de existencia de usuari
    const newPatient = await models.Patient.create({
      ...data,
      id: patientId
    });
    return newPatient
  };

  async findMyNotes(id) {
    const patientNotes = await models.Notes.findAll({
      where: {
        patientId: id
      },
      include: ['doctor', 'hospital', 'patient']
    });
    return patientNotes;
  };

  async downloadMyNotes(id) {
    const patientNotes = await this.findMyNotes(id);
    const date = new Date();
    fs.appendFile(`./../../public/${date}.${id}.txt`, patientNotes.toString(), () => {})
    return 'ok'
  };

  async findOne(id) {
    const patient = await models.Patient.findByPk(id, {
      include: ['user']
    });
    if (!patient) {
      throw boom.notFound('patient not found');
    }
    return patient
  };

  async update(id, changes) {
    const patient = await this.findOne(id);
    const answer = await patient.update(changes);
    return answer
  };

  async findByUserId(userId) {
    const user = await models.Patient.findOne({
      where: {
        userId: userId
      }
    });
    if (!user) {
      throw boom.unauthorized();
    }
    return user.dataValues.id
  };

}


module.exports = PatientServices
