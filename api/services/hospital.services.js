const boom = require("@hapi/boom"); // librería para gestionar errores
const { models } = require('./../../libs/sequelize'); // modelos del ORM para la DB
const uuid = require('uuid'); // librería para creación de uuid

// servicios de usuarios
const UserServices = require('./user.services');
const user = new UserServices();

class HospitalServices {
  constructor() {};

  async create(data) {
    const hospitalId = uuid.v4(); // creación de hospitalId
    await user.findOne(data.userId); // validación de existencia de usuario
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
      },
      include: ['doctor', 'hospital', 'patient']
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

  async findByUserId(userId) {
    const user = await models.Hospital.findOne({
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


module.exports = HospitalServices
