const express = require('express');
const app = express();
const {config} = require('../config/config'); // archivo de configuración de variables de entorno
const router = require('../network/routes'); // router de peticiones

// asignación de la app al router de peticiones
router(app);


app.listen(config.port, () => {
  console.log(`listening on port ${config.port}`)
})


