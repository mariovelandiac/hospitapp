// Router con la app de express
const express = require('express');
const router = express.router();
const {response} = require('../response');

// Capa de autenticación:
const passport = require('passport');
const {checkIdentity, checkRole} = require('./../../api/middlewares/auth.handler');

// Capa de validación de datos
const validationHandler = require('../../api/middlewares/validator.handler');
const {createPatientSchema, updatePatientSchema, getPatientSchema} = require('./../../api/schemas/patient.schema')

// Servicios de pacientes
const PatientServices = require('../../api/services/patient.services');
const service = new PatientServices();

// RUTAS

// obtener notas de un paciente en particular
router.get('/my-notes/:id',
  passport.authenticate('jwt', {session: false}), // validación de firma de token
  checkIdentity(), // validación de identidad: solo quien hace la consulta puede ver su propia historia clínica
  validationHandler(getPatientSchema, 'params'),
  getNotes
);

// obtener información de un paciente en particular
router.get('/:id',
  passport.authenticate('jwt', {session: false}), // validación de firma de token
  checkIdentity(), // validación de identidad: solo quien hace la consulta puede ver su propia información
  validationHandler(getPatientSchema, 'params'),
  getPatient
);


// primer ingreso de datos de un paciente, require de un userId -> viene en el body
router.post('/basic-data/',
  passport.authenticate('jwt', {session: false}), // validación de firma de token
  checkRole('patient'), // validación de rol, solo rol patient puede ingresar
  validationHandler(createPatientSchema, 'body'),
  createPatient
);

// actualización de datos de un paciente
router.patch('/:id',
  passport.authenticate('jwt', {session: false}), // validación de firma de token
  checkIdentity(), // validación de identidad: solo quien hace la consulta puede modificar su propia información
  validationHandler(getPatientSchema, 'params'),
  validationHandler(updatePatientSchema, 'body'),
  updatePatient
);



// funciones del CRUD

async function createPatient(req, res, next) {
  try {
    const body = req.body;
    const answer = await service.create(body);
    response.success(req, res, answer);
  } catch (err) {
      next(err);
  };
};


async function getNotes(req, res, next) {
  try {
 // el patient Id viene del token, del body y del params, los tres deben conincidir. Considerar el caso de que no venga token
    const {id} = req.params;
    const answer = await service.findMyNotes(id);
    response.success(req, res, answer);
  } catch (err) {
      next(err);
  };
};

async function getPatient(req, res, next) {
  try {
    const {id} = req.params;
    const answer = await service.findOne(id);
    response.success(req, res, answer);
  } catch (err) {
      next(err);
  };
};

async function updatePatient(req, res, next) {
  try {
    const {id} = req.params;
    const body = req.body;
    const answer = await service.update(id, body);
    response.success(req, res, answer);
  } catch (err) {
      next(err);
  };
};


module.exports = router
