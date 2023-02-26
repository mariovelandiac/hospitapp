const express = require('express');
const app = express();
const {config} = require('../config/config'); // archivo de configuración de variables de entorno
const router = require('../network/routes'); // router de peticiones
const cors = require('cors');
const {logErrors, errorHandler, boomErrorHandler,ormErrorHandler} = require('./middlewares/error.handler');

// habilitar uso de JSON
app.use(express.json());

// habilitar uso de CORS
// Objeto de configuración CORS
const whitelist = []; // array preparado para ingresar IPS de dominios permitidos para hacer peticiones. Por caso de uso, se deja abierta la API
const options = {
  origin: (origin, cb) => {
    if (whitelist.includes(origin) || !origin) {
      cb(null, true)
    } else {
      cb(new Error("domain not allowed"))
    }
  }
}
app.use(cors(options));

// invocación de capa de autenticación
require('./../utils/auth/index');

// asignación de la app al router de peticiones
router(app);

// Middleware de manejo de errores
app.use(logErrors);
app.use(ormErrorHandler);
app.use(boomErrorHandler);
app.use(errorHandler);


app.listen(config.port, () => {
  console.log(`listening on port ${config.port}`)
})


