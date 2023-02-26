const { Model, DataTypes, Sequelize} = require("sequelize");

// relación con la tabla User
const {USER_TABLE} = require('./user.model');
const {HOSPITAL_TABLE} = require('./hospital.model');
const DOCTOR_TABLE = "doctors";

const DoctorSchema = {
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
  speciality: {
    allowNull: false,
    type: DataTypes.STRING
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
    onDelete: 'NO ACTION' // Se puede eliminar un usuario pero los registros de los médicos no se eliminan
  },
  hospitalId: {
    field: 'hospital_id',
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: HOSPITAL_TABLE,
      key: 'id'
    },
    onUpdate: 'CASCADE', // Se actualiza la información del hospital
    onDelete: 'CASCADE' // Se elimna la información del hospital si se borra
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: Sequelize.NOW
  }
}

// relación uno a uno con user y uno a muchos con notas
class Doctor extends Model {
  static associate(models) {
    this.belongsTo(models.User, {as: 'user'});
    this.belongsTo(models.Hospital, {as: 'hospital'});
    this.hasMany(models.Notes, {
      as: 'notes',
      foreignKey: 'doctorId'
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: DOCTOR_TABLE,
      modelName: 'Doctor',
      timestamps: false
    }
  }
}

module.exports = { USER_TABLE, DoctorSchema, Doctor }
