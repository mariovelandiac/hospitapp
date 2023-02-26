const boom = require("@hapi/boom"); // librería para gestionar errores
const { models } = require('./../../libs/sequelize'); // modelos del ORM para la DB


class NotesServices {
  constructor() {};

  async findOne(id) {
    const note = await models.Notes.findByPk(id);
    if (!note) {
      throw boom.notFound('note not found');
    };
    return note
  };

  async update(id, changes) {
    const note = await this.findOne(id);
    const answer = await note.update(changes);
    return answer
  };

}


module.exports = NotesServices
