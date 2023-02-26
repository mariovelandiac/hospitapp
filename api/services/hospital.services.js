const boom = require("@hapi/boom"); // librería para gestionar errores
const { models } = require('./../../libs/sequelize'); // modelos del ORM para la DB
const uuid = require('uuid'); // librería para creación de uuid

class HospitalServices {
  constructor() {};

  async create(data) {
    const hospitalId = uuid.v4(); // creación de hospitalId
    const newHospital = await models.Hospital.create({
      ...data,
      id: hospitalId
    });
    return newHospital
  };

  async findNotes(id) {
    const hospitalNotes = await models.Notes.findAll({
      where: {
        hospitalId: id
      }
    });
    return hospitalNotes;
  };


  async findMyDoctors(id) {
    const hospitalDoctors = await models.Doctor.findAll({
      where: {
        hospitalId: id
      }
    });
    return hospitalDoctors;
  };


  async findOne(id) {
    const hospital = await models.Hospital.findByPk(id);
    if (!hospital) {
      throw boom.notFound('hospital not found');
    }
    return hospital
  };

  async update(id, changes) {
    const hospital = await this.findOne(id);
    const answer = await hospital.update(changes);
    return answer
  };

  static async findByUserId(id) {
    const user = await models.Hospital.findOne({
      where: {
        userId: id
      }
    });
    return user.hospitalId
  };

}


module.exports = HospitalServices
