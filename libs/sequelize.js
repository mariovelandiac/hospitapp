const { Sequelize } = require('sequelize');
const { config } = require('./../config/config');
const setupModels = require('./../db/models')

// opciones de conexión a la base de datos
const options = {
  dialect: 'postgres',
  loggin: config.isProd ? false : true
}
const sequelize = new Sequelize(config.dbURL, options);

//Se configuran e inicializan las entidades de la base de datos con sus respectivas
// variables y constrains
setupModels(sequelize);


module.exports = sequelize
