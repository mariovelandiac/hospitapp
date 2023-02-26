const boom = require("@hapi/boom"); // librería para gestionar errores
const { models } = require('./../../libs/sequelize'); // modelos del ORM para la DB
const uuid = require('uuid'); // librería para creación de uuid

// Servicios de pacientes
const PatientServices = require('./patient.services');
const patient = new PatientServices();

// Servicios de hospitales
const HospitalServices = require('./hospital.services.js');
const hospital = new HospitalServices();


class DoctorServices {
  constructor() {};

  async create(data) {
    await hospital.findOne(data.hospitalId); // validación de existencia del hospital al que se va a registrar el doctor
    const doctorId = uuid.v4(); // creación de doctorId
    const newDoctor = await models.Doctor.create({
      ...data,
      id: doctorId
    });
    return newDoctor
  };

  async createNote(data) {
    const doctor = await this.findOne(data.doctorId);
    await patient.findOne(data.patientId); // validación de que el paciente existe
    await hospital.findOne(data.hospitalId); // validación de que el hospital existe

    // validación de que el doctor ingrese el hospital para el cual trabaja
    if (doctor.hospitalId != data.hospitalId) {
      throw boom.unauthorized('The doctor does not work for that hospital')
    };

    // validación de especialidad
    if (doctor.speciality != data.speciality) {
      throw boom.unauthorized('The doctor does not have that speciliaty registred')
    };

    const noteId = uuid.v4(); // creación de noteId
    const note = await models.Notes.create({
      ...data,
      id: noteId
    });
    return note
  }

  async findMyNotes(id) {
    const doctorNotes = await models.Notes.findAll({
      where: {
        doctorId: id
      }
    });
    return doctorNotes;
  };

  async findOne(id) {
    const doctor = await models.Doctor.findByPk(id, {
      include: ['user']
    });
    if (!doctor) {
      throw boom.notFound('doctor not found');
    };
    return doctor
  };

  async update(id, changes) {
    const doctor = await this.findOne(id);
    const answer = await doctor.update(changes);
    return answer
  };

  static async findByUserId(id) {
    const user = await models.Doctor.findOne({
      where: {
        userId: id
      }
    });
    if (!user) {
      throw boom.unauthorized();
    };
    return user.doctorId
  };

}


module.exports = DoctorServices
