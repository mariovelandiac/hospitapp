const boom = require('@hapi/boom');
// Servicios de usuarios
const PatientServices = require('./../services/patient.services');
const patient = new PatientServices();
const DoctorServices = require('./../services/doctor.services');
const doctor = new DoctorServices();
const HospitalServices = require('./../services/hospital.services');
const hospital = new HospitalServices();

// response service
const {response} = require('./../../network/response')

function checkRole(...roles) {
  return function (req, res, next) {
    const user = req.user

    if (roles.includes(user.role)) {
      next()
    } else {

      response.error(req, res, 'Unauthorized',401);
    };
  };
};

function checkUserIdentity() {
  return async function (req, res, next) {
    const user = req.user;
    const {id} = req.params; // id de la solicitud

    if (user.sub === id) { // checkIdentity para usuarios
      next()
    } else {
      next(boom.unauthorized());
    };
  };
}

function checkIdentity() {
  return async function (req, res, next) {
    try {
      const user = req.user;
      const role = user.role;
      const {id} = req.params; // id de la solicitud
  
      if (role === 'patient') {
        const patientId = await patient.findByUserId(user.sub);// se busca el userid del payload del JWT
        if (patientId === id) {
          next()
        } else {
          next(boom.unauthorized());
        };
      };
  
      if (role === 'doctor') {
        const doctorId = await doctor.findByUserId(user.sub); // se busca el userid del payload del JWT
        if (doctorId === id) {
          next()
        } else {
          next(boom.unauthorized());
        };
      };
  
      if (role === 'hospital') {
        const hospitalId = await hospital.findByUserId(user.sub); // se busca el userid del payload del JWT
        if (hospitalId === id) {
          next()
        } else {
          next(boom.unauthorized());
        };
      };
    } catch(err) {
      next(err)
    }
  };
};

module.exports = {checkRole, checkIdentity, checkUserIdentity}
