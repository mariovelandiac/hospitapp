const {ValidationError} = require('sequelize');
const {response} = require('./../../network/response');

// logueo de errores
function logErrors (err, req, res, next) {
  console.log(err); // seguimiento de errores en rama dev
  next(err);
};

function boomErrorHandler (err, req, res, next) {
  if (err.isBoom) {
    const {output} = err;
    response.error(req, res, output.payload, output.statusCode);
  } else {
    next(err)
  }
}

// orm de ORM
function ormErrorHandler(err, req, res, next) {
  if (err instanceof ValidationError) {
    response.error(req, res, {
      message: err.message,
      errors: err.errors
    }, 409);
  }
  next(err)
};

function errorHandler (err, req, res, next) {
  response.error(req, res, {
    message: err.message,
    stack: err.stack
  });
};

module.exports = {logErrors,errorHandler, boomErrorHandler,ormErrorHandler}
