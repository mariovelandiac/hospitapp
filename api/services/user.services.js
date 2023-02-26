const boom = require("@hapi/boom"); // librería para gestionar errores
const { models } = require('./../../libs/sequelize'); // modelos del ORM para la DB
const bcrypt = require('bcrypt'); // librería para encriptación de contraseñas
const uuid = require('uuid'); // librería para creación de uuid

// Servicios de autenticación
const AuthServices = require('./auth.services');
const authService = new AuthServices();

class UserServices {
  constructor() {};

  async createUser(data, role) {
    const userId = uuid.v4(); // creación de userId
    const hash = await bcrypt.hash(data.password, 10); // hasheo de contraseña
    const answer = await authService.create(userId, hash, data.email, role); // creación de usuario según rol en la tabla de Auth
    delete data.password // no se guarda en user la contraseña
    const newUser = await models.User.create({
      ...data,
      id: userId,
      role: role
    });
    return {
      newUser,
      message: answer
    }
  };

  async findOne(id) {
    const user = await models.User.findByPk(id);
    if (!user) {
      throw boom.notFound('user not found');
    }
    return user
  };

  async update(id, changes) {
    const user = await this.findOne(id);
    if (changes.email) {
      await authService.updateEmail(changes.email);
    };
    const answer = await user.update(changes);
    return answer
  };

  async delete(id) {
    const user = await this.findOne(id);
    await user.destoy();
    const answer = `user whit id ${id} has been removed`;
    return answer
  };
}


module.exports = UserServices
