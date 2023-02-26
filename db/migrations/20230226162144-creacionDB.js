'use strict';

const { AUTH_TABLE } = require('../models/auth.model');
const { USER_TABLE } = require('../models/user.model');
const { PATIENT_TABLE } = require('../models/patient.model');
const { DOCTOR_TABLE } = require('../models/doctor.model');
const { HOSPITAL_TABLE } = require('../models/hospital.model');
const { NOTES_TABLE } = require('../models/notes.model');
const {DataTypes, Sequelize} = require('sequelize')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // creación de tablas de la base de datos

  async up (queryInterface) {

    await queryInterface.createTable(USER_TABLE, {  id: {
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
      type: DataTypes.STRING
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      field: 'created_at',
      defaultValue: Sequelize.NOW
    }});

    await queryInterface.createTable(AUTH_TABLE, {
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
    });

    await queryInterface.createTable(PATIENT_TABLE, {  id: {
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
    }});

    await queryInterface.createTable(HOSPITAL_TABLE, {  id: {
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
      type: DataTypes.ARRAY(DataTypes.STRING)
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
    }});

    await queryInterface.createTable(DOCTOR_TABLE, {  id: {
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
    }});


    await queryInterface.createTable(NOTES_TABLE, {  id: {
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
        model: PATIENT_TABLE,
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
        model: DOCTOR_TABLE,
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
        model: HOSPITAL_TABLE,
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
    }});


  },

  async down (queryInterface) {
    await queryInterface.dropTable(AUTH_TABLE);
    await queryInterface.dropTable(USER_TABLE);
    await queryInterface.dropTable(PATIENT_TABLE);
    await queryInterface.dropTable(DOCTOR_TABLE);
    await queryInterface.dropTable(HOSPITAL_TABLE);
    await queryInterface.dropTable(NOTES_TABLE);
  }
};
