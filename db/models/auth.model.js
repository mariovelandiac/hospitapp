const { Model, DataTypes, Sequelize} = require("sequelize");

// relación con la tabla User
const {USER_TABLE} = require('./user.model');
const AUTH_TABLE = "auth";

const AuthSchema = {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID
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
  password: {
    allowNull: false,
    type: DataTypes.STRING
  },
  verifyToken: {
    field: 'verify_token',
    allowNull: true,
    type: DataTypes.STRING
  },
  recoveryToken: {
    field: 'recovery_token',
    allowNull: true,
    type: DataTypes.STRING
  },
  modifyPassword: {
    field: 'modify_password',
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: false // valor por defecto de modifyPassword
  },
  isVerify: {
    field: 'is_verify',
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: false // valor por defecto de isVerify
  },
  lastRecovery: {
    allowNull: true,
    field: 'last_recovery',
    type: DataTypes.DATE,
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
class Auth extends Model {
  static associate(models) {
    this.belongsTo(models.User, {as: 'user'});
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: AUTH_TABLE,
      modelName: 'Auth',
      timestamps: false
    }
  }
}

module.exports = { AUTH_TABLE, AuthSchema, Auth }
