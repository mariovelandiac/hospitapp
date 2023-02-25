// Vínculo con la app de express
const express = require('express');
const router = express.router();
const {response} = require('./../response');

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
  getUser
);


// actualizar datos básicos de un usuario
router.patch('/:id',
  validationHandler(getUserSchema, 'params'),
  validationHandler(updateUserSchema, 'body'),
  updateUser
);

// eliminar usuario, solo lo puede hacer el propio usuario
router.delete('/:id',
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
    const body = req.body
    const user = await service.update(id, body);
    response.success(req, res, user);
  } catch (err) {
    next(err);
  };
};

async function deleteUser(req, res, next) {
  try {
    const {id} = req.params;
    const answer = await service.remove(id);
    response.success(req, res, answer);
  } catch (err) {
    next(err);
  };
};


module.exports = router
