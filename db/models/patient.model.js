const { Model, DataTypes, Sequelize} = require("sequelize");

// relación con la tabla User
const {USER_TABLE} = require('./user.model')
const PATIENT_TABLE = "patients"

const PatientSchema = {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING
  },
  address: {
    allowNull: false,
    type: DataTypes.STRING
  },
  dateOfBirth: {
    allowNull: false,
    type: DataTypes.DATE,
  },
  role: {
    allowNull: false,
    type: DataTypes.STRING,
    defaultValue: 'patient'
  },
  gender: {
    allowNull: true,
    type: DataTypes.STRING
  },
  userId: {
    field: 'user_id',
    allowNull: false,
    type: DataTypes.UUID,
    unique: true,
    references: {
      model: USER_TABLE,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'NO ACTION'
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: Sequelize.NOW
  }
}

// relación uno a uno con user y uno a muchos con notas
class Patient extends Model {
  static associate(models) {
    this.belongsTo(models.User, {as: 'user'});
    this.hasMany(models.Notes, {
      as: 'notes',
      foreignKey: 'patientId'
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: PATIENT_TABLE,
      modelName: 'Patient',
      timestamps: false
    }
  }
}

module.exports = { USER_TABLE, PatientSchema, Patient }
