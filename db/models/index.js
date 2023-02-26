const { AuthSchema, Auth } = require('./auth.model');
const { UserSchema, User } = require('./user.model');
const { PatientSchema, Patient } = require('./patient.model');
const { DoctorSchema, Doctor } = require('./doctor.model');
const { HospitalSchema, Hospital } = require('./hospital.model');
const { NotesSchema, Notes } = require('./notes.model');

function setupModels(sequelize) {
  Auth.init(AuthSchema, Auth.config(sequelize));
  User.init(UserSchema, User.config(sequelize));
  Patient.init(PatientSchema, Patient.config(sequelize));
  Doctor.init(DoctorSchema, Doctor.config(sequelize));
  Hospital.init(HospitalSchema, Hospital.config(sequelize));
  Notes.init(NotesSchema, Notes.config(sequelize));

  Auth.associate(sequelize.models);
  User.associate(sequelize.models);
  Patient.associate(sequelize.models);
  Doctor.associate(sequelize.models);
  Hospital.associate(sequelize.models);
  Notes.associate(sequelize.models);

}

module.exports = setupModels;
