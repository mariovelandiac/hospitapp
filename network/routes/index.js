// index para modulo de router
const express = require('express');
const userRouter = require('./user.router'); // se importa el router de usuarios
const patientRouter = require('./patient.router'); // se importa el router de pacientes
const hospitalRouter = require('./hospital.router'); // se importa el router de hospital
const doctorRouter = require('./doctor.router'); // se importa del router de médicos y médicas
const notesRouter = require('./notes.router'); // se importa el router de observaciones médicas

// función de respuesta homogenea
const {response} = require('./../response')
// función de redireccionamiento de peticiones según el endpoint
function routerAPI(app) {
  const router = express.Router();
  app.use('/', (req, res) =>{
    res.send('Hola, pronto te voy a redirigir'); // la raíz es redirigida a /api/v1
  });
  app.use('/api/v1/', (req, res) =>{
    res.send('Hola, aquí íria un redireccionamiento a la documentación'); // api/v1/ va redirigida a la documentación
  });
  app.use('/api/v1/docs', (req, res) => {
    res.send('Aquí va a ir la documentación de la API'); // documentación de la api
  });
  router.use('/user', userRouter); // rutas para los usuarios
  router.use('/doctor', doctorRouter); // rutas para los usuarios
  router.use('/patient', patientRouter); // rutas para los médicos y médicas
  router.use('/hospital', hospitalRouter); // rutas para los hospitales
  router.use('/notes', notesRouter); // rutas para las notas médicas
  app.use('/:other', (req, res) => {
    response.success(req, res, 'Not Found', 404) // respuesta para todas las demás peticiones
  });
};

module.exports = routerAPI
