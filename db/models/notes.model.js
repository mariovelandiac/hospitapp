const { Model, DataTypes, Sequelize} = require("sequelize");

// relación con la tabla User
const {USER_TABLE} = require('./user.model');
const NOTES_TABLE = "notes";

const NotesSchema = {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID
  },
  note: {
    allowNull: false,
    type: DataTypes.STRING
  },
  speciality: {
    allowNull: false,
    type: DataTypes.STRING
  },
  healthState: {
    allowNull: false,
    type: DataTypes.STRING
  },
  validity: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defalutValue: true
  },
  hospitalNote: {
    field: 'hospital_note',
    allowNull: true,
    type: DataTypes.STRING
  },
  patientId: {
    field: 'patient_id',
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: USER_TABLE,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE' // Se puede eliminar un usuario y sus datos de autenticación se eliminarán
  },
  doctorId: {
    field: 'doctor_id',
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: USER_TABLE,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE' // Se puede eliminar un usuario y sus datos de autenticación se eliminarán
  },
  hospitalId: {
    field: 'hospital_id',
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: USER_TABLE,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE' // Se puede eliminar un usuario y sus datos de autenticación se eliminarán
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: Sequelize.NOW
  }
}

// relación uno a uno con user
class Notes extends Model {
  static associate(models) {
    this.belongsTo(models.Patient, {as: 'patient'});
    this.belongsTo(models.Doctor, {as: 'doctor'});
    this.belongsTo(models.Hospital, {as: 'hospital'});
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: NOTES_TABLE,
      modelName: 'Notes',
      timestamps: false
    }
  }
}

module.exports = { NOTES_TABLE, NotesSchema, Notes }
