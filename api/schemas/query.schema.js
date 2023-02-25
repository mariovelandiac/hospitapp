const Joi = require('joi');


const limit = Joi.number();
const offset = Joi.number();

// Schema de query para limitar la cantidad de elementos mostrados en una petición get
const querySchema = Joi.object({
  limit: limit,
  offset: offset
});

module.exports = {querySchema}
