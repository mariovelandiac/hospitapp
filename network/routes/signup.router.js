// Router con la app de express
const express = require('express');
const router = express.Router();
const {response} = require('./../response');

// Capa de autenticación:
const passport = require('passport');
const {checkRole} = require('./../../api/middlewares/auth.handler');


// Capa de validación de datos
const validationHandler = require('../../api/middlewares/validator.handler');
const {createUserSchema} = require('../../api/schemas/user.schema');

// Servicios de usuarios
const UserServices = require('../../api/services/user.services');
const service = new UserServices();

// RUTAS

// crear usario de tipo paciente. Cualquiera puede, no es necesario login
router.post('/',
  validationHandler(createUserSchema, 'body'),
  createUserPatient
);

// crear usario de tipo doctor. Solo hospital puede hacerlo
router.post('/doctor',
  validationHandler(createUserSchema, 'body'),
  passport.authenticate('jwt', {session: false}), // el hospital debe iniciar sesión para crear el usuario doctor
  checkRole('hospital'), // solo el rol hospital puede crear un doctor y debe haber iniciado sesión
  createUserDoctor
);


// crear usario de tipo hospital. Solo admin puede hacerlo
router.post('/hospital',
  validationHandler(createUserSchema, 'body'),
  passport.authenticate('jwt', {session: false}), // el admin debe iniciar sesión para crear el usuario doctohospitalr
  checkRole('admin'), // solo el rol admin puede crear un doctor y debe haber iniciado sesión
  createUserHospital
);


async function createUserPatient(req, res, next) {
  try {
    const body = req.body;
    const role = 'patient';
    const newUser = await service.createUser(body, role);
    response.success(req, res, newUser, 201);
  } catch (err) {
      next(err);
  };
};


async function createUserDoctor(req, res, next) {
  try {
    const body = req.body;
    const role = 'doctor';
    const newUser = await service.createUser(body, role);
    response.success(req, res, newUser, 201);
  } catch (err) {
      next(err);
  };
};

async function createUserHospital(req, res, next) {
  try {
    const body = req.body;
    const role = 'hospital';
    const newUser = await service.createUser(body, role);
    response.success(req, res, newUser, 201);
  } catch (err) {
      next(err);
  };
};


module.exports = router
