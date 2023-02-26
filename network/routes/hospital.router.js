// Router con la app de express
const express = require('express');
const router = express.Router();
const {response} = require('../response');

// Capa de autenticación:
const passport = require('passport');
const {checkIdentity, checkRole} = require('./../../api/middlewares/auth.handler');

// Capa de validación de datos
const validationHandler = require('../../api/middlewares/validator.handler');
const {createHospitalSchema, updateHospitalSchema, getHospitalSchema} = require('./../../api/schemas/hospital.schema')

// Servicios de hospital
const HospitalServices = require('../../api/services/hospital.services');
const service = new HospitalServices();

// RUTAS

// obtener notas de un hospital en particular
router.get('/get-notes/:id',
  validationHandler(getHospitalSchema, 'params'),
  passport.authenticate('jwt', {session: false}), // validación de firma de token
  checkRole('hospital'), // validación de rol
  checkIdentity(), // validación de identidad: solo quien hace la consulta puede ver los registros de sus médicos en la historia clínica
  getNotes
);

// obtener los médicos asociados a un hospital en particular
router.get('/my-doctors/:id',
  validationHandler(getHospitalSchema, 'params'),
  passport.authenticate('jwt', {session: false}),
  checkRole('hospital'), // validación de rol // validación de firma de token
  checkIdentity(), // validación de identidad: solo quien hace la consulta puede ver sus doctores
  getDoctors
);

// obtener información de un hospital en particular
router.get('/:id',
  validationHandler(getHospitalSchema, 'params'),
  passport.authenticate('jwt', {session: false}), // validación de firma de token
  checkRole('hospital'), // validación de rol
  checkIdentity(), // validación de identidad: solo quien hace la consulta puede ver sus datos de hospital
  getHospital
);


// primer ingreso de datos de un hospital, require de un userId -> viene en el token y en el body
router.post('/basic-data/',
  validationHandler(createHospitalSchema, 'body'),
  passport.authenticate('jwt', {session: false}), // validación de firma de token
  checkRole('hospital'), // solo rol hospital puede acceder a este endpoint
  createHospital
);

// actualización de datos de un hospital
router.patch('/:id',
  validationHandler(getHospitalSchema, 'params'),
  validationHandler(updateHospitalSchema, 'body'),
  passport.authenticate('jwt', {session: false}), // validación de firma de token
  checkRole('hospital'), // validación de rol
  checkIdentity(), // validación de identidad: solo quien hace la consulta puede actualizar sus datos de hospital
  updateHospital
);



// funciones del CRUD

async function createHospital(req, res, next) {
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
 // el hospital Id viene del token, del body y del params, los tres deben conincidir. Considerar el caso de que no venga token
    const {id} = req.params;
    const answer = await service.findNotes(id);
    response.success(req, res, answer);
  } catch (err) {
      next(err);
  };
};

async function getHospital(req, res, next) {
  try {
    const {id} = req.params;
    const answer = await service.findOne(id);
    response.success(req, res, answer);
  } catch (err) {
      next(err);
  };
};

async function getDoctors(req, res, next) {
  try {
    const {id} = req.params;
    const answer = await service.findMyDoctors(id);
    response.success(req, res, answer);
  } catch (err) {
      next(err);
  };
};

async function updateHospital(req, res, next) {
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
