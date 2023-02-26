// Vínculo con la app de express
const express = require('express');
const router = express.Router();
const {response} = require('./../response');

// Capa de autenticación y autorización
const passport = require('passport')

// Capa de validación de datos
const validationHandler = require('../../api/middlewares/validator.handler');
const {getEmailSchema, newPasswordSchema, verifyEmailSchema, loginSchema} = require('../../api/schemas/auth.schema');

// Servicios de autenticación
const AuthServices = require('../../api/services/auth.services');
const service = new AuthServices();

// RUTAS


// confirmar email por método post, el token debe venir en el body
router.post('/verify-email',
  validationHandler(verifyEmailSchema, 'body'),
  verifyEmail
);

// ingresar a la aplicación
router.post('/login',
  validationHandler(loginSchema, 'body'),
  passport.authenticate('local', {session: false}), // se utiliza capa de autenticación local para auteticar login
  login
);

// restablecer contraseña
router.post('/recovery-password',
  validationHandler(getEmailSchema, 'body'),
  recoveryPassword
);

// nueva contraseña
router.post('/change-password',
  validationHandler(newPasswordSchema, 'body'),
  changePassword
);



// funciones del CRUD

async function verifyEmail(req, res, next) {
  try {
    const {token} = req.body;
    const answer = await service.confirmEmail(token);
    response.success(req, res, answer);
  } catch (err) {
      next(err);
  };
};


async function login(req, res, next) {
  try {
    const user = req.user;
    const answer = await service.signToken(user); // se firma el token con el id del usuario y su rol
    response.success(req, res, answer);
  } catch (err) {
      next(err);
  };
};


async function recoveryPassword(req, res, next) {
  try {
    const {email} = req.body;
    const answer = await service.sendRecovery(email);
    response.success(req, res, answer);
  } catch (err) {
      next(err);
  };
};

async function changePassword(req, res, next) {
  try {
    const {token, newPassword} = req.body;
    const answer = await service.changePassword(token,newPassword);
    response.success(req, res, answer);
  } catch (err) {
      next(err);
  };
};


module.exports = router
