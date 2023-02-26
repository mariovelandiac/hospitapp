const boom = require("@hapi/boom"); // librería para gestionar errores
const { models } = require('./../../libs/sequelize'); // modelos del ORM para la DB
const uuid = require('uuid'); // librería para creación de uuid

class PatientServices {
  constructor() {};

  async create(data) {
    const patientId = uuid.v4(); // creación de patientId
    const newPatient = await models.Patient.create({
      ...data,
      id: patientId
    });
    return newPatient
  };

  async findMyNotes(id) {
    const patientNotes = await models.Notes.findAll({
      where: {
        patiendId: id
      }
    });
    return patientNotes;
  };

  async findOne(id) {
    const patient = await models.Patient.findByPk(id);
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

  static async findByUserId(id) {
    const user = await models.Patient.findOne({
      where: {
        userId: id
      }
    });
    return user.patientId
  };

}


module.exports = PatientServices
