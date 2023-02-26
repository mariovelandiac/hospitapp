const { Model, DataTypes, Sequelize} = require("sequelize");

const USER_TABLE = "users"

const UserSchema = {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID
  },
  pid: {
    allowNull: false,
    unique: true,
    type: DataTypes.INTEGER
  },
  email: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true
  },
  role: {
    allowNull: false,
    type: DataTypes.STRING,
    defaultValue: 'patient'
  },
  phone: {
    allwNull: false,
    type: DataTypes.INTEGER
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: Sequelize.NOW
  }
}

// relación uno a uno con auth, patient, doctor y hospital
class User extends Model {
  static associate(models) {
    this.hasOne(models.Auth, {
      as: 'auth',
      foreignKey: 'userId'
    });
    this.hasOne(models.Patient, {
      as: 'patient',
      foreignKey: 'userId'
    });
    this.hasOne(models.Doctor, {
      as: 'doctor',
      foreignKey: 'userId'
    });
    this.hasOne(models.Hospital, {
      as: 'hospital',
      foreignKey: 'userId'
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: USER_TABLE,
      modelName: 'User',
      timestamps: false
    }
  }
}

module.exports = { USER_TABLE, UserSchema, User }
