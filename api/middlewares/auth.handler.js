const boom = require('@hapi/boom');

// Servicios de usuarios
const PatientServices = require('./../services/patient.services');
const DoctorServices = require('./../services/doctor.services');
const HospitalServices = require('./../services/hospital.services');



function checkRole(...roles) {
  return function (req, res, next) {
    const user = req.user
    if (roles.includes(user.role)) {
      next()
    } else {
      next(boom.forbidden())
    };
  };
};

function checkIdentity() {
  return async function (req, res, next) {
    const user = req.user;
    const role = user.role;
    const {id} = req.params; // id de la solicitud

    if (role === 'patient') {
      const patientId = await PatientServices.findByUserId(user.sub); // se busca el userid del payload del JWT
      if (patientId === id) {
        next()
      } else {
        next(boom.unauthorized());
      };
    };

    if (role === 'doctor') {
      const doctorId = await DoctorServices.findByUserId(user.sub); // se busca el userid del payload del JWT
      if (doctorId === id) {
        next()
      } else {
        next(boom.unauthorized());
      };
    };

    if (role === 'hospital') {
      const hospitalId = await HospitalServices.findByUserId(user.sub); // se busca el userid del payload del JWT
      if (hospitalId === id) {
        next()
      } else {
        next(boom.unauthorized());
      };
    };

    // si el rol no está en ninguno de los anteriores
    next(boom.forbidden())
  }
}

module.exports = {checkRole, checkIdentity}
