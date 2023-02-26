// Vínculo con la app de express
const express = require('express');
const router = express.Router();
const {response} = require('../response');

// Capa de autenticación:
const passport = require('passport');
const {checkIdentity, checkRole} = require('./../../api/middlewares/auth.handler');


// Capa de validación de datos
const validationHandler = require('../../api/middlewares/validator.handler');
const {getNoteSchema, updateNoteSchema} = require('../../api/schemas/notes.schema');

// Servicios de notas médicas
const NotesServices = require('../../api/services/notes.services');
const service = new NotesServices();

// RUTAS

// actualización de notas, solo para rol 'hospital'
router.patch('/:id',
  validationHandler(getNoteSchema, 'params'), // validación de datos
  validationHandler(updateNoteSchema, 'body'),
  passport.authenticate('jwt', {session: false}), // validación de firma de token
  checkRole('hospital'), // validación de rol
  checkIdentity(), // validación de identidad
  updateNote
);



// funciones del CRUD

async function updateNote(req, res, next) {
  try {
    const body = req.body;
    const {id} = req.params;
    const answer = await service.update(id, body);
    response.success(req, res, answer);
  } catch (err) {
    next(err);
  };
};


module.exports = router
