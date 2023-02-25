// Router con la app de express
const express = require('express');
const router = express.router();
const {response} = require('../response');

// Capa de validación de datos
const validationHandler = require('../../api/middlewares/validator.handler');
const {createNoteSchema} = require('../../api/schemas/notes.schema');
const {createDoctorSchema, updateDoctorSchema, getDoctorSchema} = require('./../../api/schemas/doctor.schema')

// Servicios de médicos/as
const DoctorServices = require('../../api/services/doctor.services');
const service = new DoctorServices();

// RUTAS

// obtener notas de un médico/a en particular
router.get('/my-notes/:id',
  validationHandler(getDoctorSchema, 'params'),
  getNotes
);

// obtener información de un médico/a en particular
router.get('/:id',
  validationHandler(getDoctorSchema, 'params'),
  getDoctor
);

// creación de notas por un médico/a
router.post('/add-note',
  validationHandler(createNoteSchema, 'body'),
  createNote
);

// primer ingreso de datos de un médico, require de un userId -> viene en el token y en el body
router.post('/basic-data/',
  validationHandler(createDoctorSchema, 'body'),
  createDoctor
);

// actualización de datos de un médico/a -> el id se genera automaticamente con la creación de usuario
router.patch('/:id',
  validationHandler(getDoctorSchema, 'params'),
  validationHandler(updateDoctorSchema, 'body'),
  updateDoctor
);



// funciones del CRUD

async function createNote(req, res, next) {
  try {
    const body = req.body;
    const answer = await service.createNote(body);
    response.success(req, res, answer);
  } catch (err) {
      next(err);
  };
};


async function createDoctor(req, res, next) {
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
 // el doctor Id viene del token, del body y del params, los tres deben conincidir. Considerar el caso de que no venga token
    const {id} = req.params;
    const answer = await service.findMyNotes(id);
    response.success(req, res, answer);
  } catch (err) {
      next(err);
  };
};

async function getDoctor(req, res, next) {
  try {
    const {id} = req.params;
    const answer = await service.findOne(id);
    response.success(req, res, answer);
  } catch (err) {
      next(err);
  };
};

async function updateDoctor(req, res, next) {
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
