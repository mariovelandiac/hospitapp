// Vínculo con la app de express
const express = require('express');
const router = express.router();
const {response} = require('./../response');

// Capa de validación de datos
const validationHandler = require('../../api/middlewares/validator.handler');
const {createUserSchema} = require('../../api/schemas/user.schema');

// Servicios de autenticación
const AuthServices = require('../../api/services/auth.services');
const service = new AuthServices();

// RUTAS

// confirmar email
router.post('/confirm-email',
  validationHandler(createUserSchema, 'body'),
  confirmEmail
);

// ingresar a la aplicación
router.post('/login',
  login
);

// restablecer contraseña
router.post('/reset-password',
  resetPassword
);



// funciones del CRUD

async function confirmEmail(req, res, next) {
  try {
    const body = req.body
    const answer = await service.confirmEmail(body);
    response.success(req, res, answer);
  } catch (err) {
    next(err);
  };
};


async function login(req, res, next) {
  try {
    const body = req.body
    const answer = await service.signToken(body);
    response.success(req, res, answer)
  } catch (err) {
    next(err);
  };
};


async function resetPassword(req, res, next) {
  try {
    const {email} = req.body;
    const answer = await service.sendRecovery(email);
    response.success(req, res, answer);
  } catch (err) {
    next(err);
  };
};


module.exports = router
