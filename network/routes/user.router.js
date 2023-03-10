// Router con la app de express
const express = require('express');
const router = express.Router();
const {response} = require('./../response');

// Capa de autenticación:
const passport = require('passport');
const {checkUserIdentity} = require('./../../api/middlewares/auth.handler');

// Capa de validación de datos
const validationHandler = require('../../api/middlewares/validator.handler');
const {getUserSchema, updateUserSchema} = require('../../api/schemas/user.schema');

// Servicios de usuarios
const UserServices = require('../../api/services/user.services');
const service = new UserServices();


// RUTAS

// obtener un usuario
router.get('/:id',
  validationHandler(getUserSchema, 'params'),
  passport.authenticate('jwt', {session: false}), // validación de firma de token
  checkUserIdentity(), // validación de identidad: solo quien hace la consulta puede ver su propio usuario
  getUser
);


// actualizar datos de registro de un usuario
router.patch('/:id',
  validationHandler(getUserSchema, 'params'),
  validationHandler(updateUserSchema, 'body'),
  passport.authenticate('jwt', {session: false}), // validación de firma de token
  checkUserIdentity(), // validación de identidad: solo quien hace actualizar puede ver su propio usuario
  updateUser
);

// eliminar usuario, solo lo puede hacer el propio usuario
router.delete('/:id',
  validationHandler(getUserSchema, 'params'),
  passport.authenticate('jwt', {session: false}), // validación de firma de token
  checkUserIdentity(), // validación de identidad: solo quien hace la consulta puede borrar su propio usuario
  deleteUser
);

// funciones del CRUD

async function getUser(req, res, next) {
  try {
    const {id} = req.params;

    if (req.user.role === 'patient') {
      const userFound = await service.findOnePatient(id);
      response.success(req, res, userFound);
    };
    
    if (req.user.role === 'doctor') {
      const userFound = await service.findOneDoctor(id);
      response.success(req, res, userFound);
    };

    if (req.user.role === 'hospital') {
      const userFound = await service.findOneHospital(id);
      response.success(req, res, userFound);
    };

  } catch (err) {
    next(err);
  };
};

async function updateUser(req, res, next) {
  try {
    const {id} = req.params;
    const body = req.body;
    const user = await service.update(id, body);
    response.success(req, res, user);
  } catch (err) {
    next(err);
  };
};

async function deleteUser(req, res, next) {
  try {
    const {id} = req.params;
    const answer = await service.delete(id);
    response.success(req, res, answer);
  } catch (err) {
    next(err);
  };
};


module.exports = router
