// Vínculo con la app de express
const express = require('express');
const router = express.router();
const {response} = require('./../response');

// Capa de validación de datos
const validationHandler = require('../../api/middlewares/validator.handler');
const {createUserSchema} = require('../../api/schemas/user.schema');

// Servicios de usuarios
const UserServices = require('../../api/services/user.services');
const service = new UserServices();

// RUTAS

router.post('/',
  validationHandler(createUserSchema, 'body'),
  createUser
);


async function createUser(req, res, next) {
  try {
    const body = req.body;
    const newUser = service.create(body);
    response.success(req, res, newUser, 201);
  } catch (err) {
    next(err);
  };
};


module.exports = router
