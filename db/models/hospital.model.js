const { Model, DataTypes, Sequelize} = require("sequelize");

// relación con la tabla User
const {USER_TABLE} = require('./user.model');
const HOSPITAL_TABLE = "hospitals";

const HospitalSchema = {
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
  services: {
    allowNull: false,
    type: DataTypes.ARRAY
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
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: Sequelize.NOW
  }
}

// relación uno a uno con user y uno a muchos con hospital
class Hospital extends Model {
  static associate(models) {
    this.belongsTo(models.User, {as: 'user'});
    this.hasMany(models.Doctor, {
      as: 'doctor',
      foreignKey: 'hospitalId'
    });
    this.hasMany(models.Notes, {
      as: 'notes',
      foreignKey: 'hospitalId'
    });
  };

  static config(sequelize) {
    return {
      sequelize,
      tableName: HOSPITAL_TABLE,
      modelName: 'Hospital',
      timestamps: false
    }
  }
}

module.exports = { USER_TABLE, HospitalSchema, Hospital }
