// Router con la app de express
const express = require('express');
const router = express.Router();
const {response} = require('./../response');

// Capa de autenticación:
const passport = require('passport');
const {checkIdentity} = require('./../../api/middlewares/auth.handler');

// Capa de validación de datos
const validationHandler = require('../../api/middlewares/validator.handler');
const {getUserSchema, updateUserSchema} = require('../../api/schemas/user.schema');

// Servicios de usuarios
const UserServices = require('../../api/services/user.services');
const service = new UserServices();


// RUTAS

// obtener un usuario
router.get('/:id',
  passport.authenticate('jwt', {session: false}), // validación de firma de token
  checkIdentity(), // validación de identidad: solo quien hace la consulta puede ver su propio usuario
  validationHandler(getUserSchema, 'params'),
  getUser
);


// actualizar datos de registro de un usuario
router.patch('/:id',
  passport.authenticate('jwt', {session: false}), // validación de firma de token
  checkIdentity(), // validación de identidad: solo quien hace actualizar puede ver su propio usuario
  validationHandler(getUserSchema, 'params'),
  validationHandler(updateUserSchema, 'body'),
  updateUser
);

// eliminar usuario, solo lo puede hacer el propio usuario
router.delete('/:id',
  passport.authenticate('jwt', {session: false}), // validación de firma de token
  checkIdentity(), // validación de identidad: solo quien hace la consulta puede borrar su propio usuario
  validationHandler(getUserSchema, 'params'),
  deleteUser
);

// funciones del CRUD

async function getUser(req, res, next) {
  try {
    const {id} = req.params;
    const user = await service.findOne(id);
    response.success(req, res, user);
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
