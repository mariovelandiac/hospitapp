const boom = require("@hapi/boom"); // librería para gestionar errores
const bcrypt = require('bcrypt'); // librería para hash de contraseñas
const jwt = require('jsonwebtoken'); // librería para firmar y verificar JWT
const {config} = require('./../../config/config'); // archivo de configuración
const nodemailer = require('nodemailer'); // nodemailer para envío de correos
const {models} = require('./../../libs/sequelize'); // modelos del ORM para la DB
const uuid = require('uuid'); // librería para creación de uuid

class AuthServices {
  constructor() {
  }

  async create(userId, password, email, role) {
    const data = { // datos iniciales de usuario
      id: uuid.v4(),
      userId: userId,
      password: password,
      email: email,
      role: role,
      isVerify: false,        // verificación de email por defecto es false, cuando se verifique el email, pasa a true
      modifyPassword: false  // verificación de contraseña por defecto es false, cuando se cambie la contraseña, pasa a true
    };
    await models.Auth.create(data); // registro en la base de datos de credenciales
    const rta = await this.verifyEmail(data.id, role, email); // envio de correo de verificación de email
    return rta
  }

  async verifyEmail(id, role, email) {

    const payload = {
      sub: id, // id de autenticación, diferente al de usuario
      role: role
    };

    const expiresIn = '24h'; // tiempo de expiración del token
    const token = jwt.sign(payload, config.jwtVerifyEmail, {expiresIn: expiresIn});
    await this.update(id, {verifyToken: token}); // registro de token en la base de datos de Auth
    const link = `${config.host}/verify-email?token=${token}`;
    const endpoint = `${config.host}/api/v1/auth/verify-email`;
    const mail = {
      from: config.mailuser, // sender address
      to: `${email}`, // quien recibe el correo
      subject: `Verifica tu correo electrónico`, // Subject line
      html: `<b>¡Hola! Estamos felices de que te hayas unido a nuestra app para gestionar tu historia clínica, por favor ve al siguiente link para continuar con el proceso</b>
              <br> Para continuar, sigue este link: ${link}
              <br> <b>Nota: Este link tiene una validez de ${expiresIn}
              <br> NotaAclaratoria: El endpoint para enviar el token es ${endpoint}, éste debe ser enviado a través del body</b>`,
      };
    const answer = await this.sendMail(mail);
    return `${answer.message}: please check your email ${email} to continue`
  };

  async confirmEmail(token) {
    try {
      const payload = jwt.verify(token, config.jwtVerifyEmail); // se verifica que sea la misma firma
      const credential = await this.findOne(payload.sub); // se busca la credencial con el id firmado

      if(credential.isVerify) { // validación de que el correo ya fue verificado
        return `el email ${credential.email} ya ha sido verificado`
      }

      if (credential.verifyToken !== token) { // validación de correspondencia con el token enviado
        throw boom.unauthorized();
      };

      await this.update(payload.sub, {verifyToken: null, isVerify: true}); // actualización de token a null para que no se reutilice

      if (credential.role === 'doctor' || credential.role === 'hospital') { // en caso de que el rol sea hospital o doctor
        if (!credential.modifyPassword) { // se valida que la contraseña no haya sido modificada
          const rta = await this.sendRecovery(credential.email);
          const message = `${rta.message}: an email to change your password has been sent to ${credential.email}, please update your password`
          return message
        };
      };
      const message = 'email verified. Please log in to continue and fill your basic-data';
      return message
    } catch(err) {
        throw boom.unauthorized()
    }
  };

  async getCredential(email, password) {
    const credential = await this.findByEmail(email)
    // validación de correspondencia
    const isMatch = await bcrypt.compare(password, credential.password);
    if (!isMatch) {
      throw boom.unauthorized(), false;
    }
    delete credential.dataValues.password // se elimina la contraseña del objeto en memoria
    return credential
  };

  async signToken(credential) {
    const payload = {
      sub: credential.userId,
      role: credential.role
    };
    if (!credential.isVerify) {
      throw boom.unauthorized('please verify your email'); // error de que se debe cambiar contraseña para poder ingresar
    };
    if (credential.role === 'doctor' || credential.role === 'hospital') {
        if (!credential.modifyPassword) {
          throw boom.unauthorized('please change your password'); // error de que se debe cambiar contraseña para poder ingresar
        }
    }
    const token = jwt.sign(payload, config.jwtsecret);
    return {
      userId: credential.userId,
      token: token
    };
  };

  async sendRecovery(email) {
    const credential = await this.findByEmail(email);
    const payload = { sub: credential.dataValues.id };
    const expiresIn = '15h'; // tiempo de expiración del token

    // el token funciona con el id de credential
    const token = jwt.sign(payload, config.jwtRecovery, {expiresIn: expiresIn});

    const link = `${config.host}/verify-email?token=${token}`;
    const endpoint = `${config.host}/api/v1/auth/change-password`;

    await this.update(credential.id, {recoveryToken: token}); // inclusión del recovery Token en la base de datos para futura validación

    const mail = {
      from: config.mailuser, // sender address
      to: `${credential.email}`, // list of receivers
      subject: `Hola, ¿Olvidaste tu contraseña?`, // Subject line
      html: `<b>Tranquil@, en este link podrás recuperarla</b>
            <br> Da click aquí para continuar ${link}
            <br> <b>Nota: Este link tiene una validez de ${expiresIn}
            <br> NotaAclaratoria: El endpoint para enviar el token y la nueva contraseña es ${endpoint}, estos debe ser enviado a través del body</b>`,
    };
    const rta = await this.sendMail(mail)
    return rta
  }

  async changePassword(token, newPassword) {
    try {
      const payload = jwt.verify(token, config.jwtRecovery);
      const credential = await this.findOne(payload.sub);

      if (credential.dataValues.recoveryToken !== token) { // validación del recoveryToken
        throw boom.unauthorized();
      };

      const hash = await bcrypt.hash(newPassword, 10);
      await this.update(credential.id, {
        recoveryToken: null,
        password: hash,
        lastRecovery: new Date(),
        modifyPassword: true
      });
      return {message: 'password changed'}
    } catch (e) {
        throw boom.unauthorized();
    };
  };

  async sendMail(infoMail) {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      secure: true,
      port: 465,
      auth: {
          user: config.mailuser,
          pass: config.mailpassword
      }
    });
    await transporter.sendMail(infoMail);
    return { message: 'mail sent'}
  };

  async findByEmail(email) {
    const credential = await models.Auth.findOne({
      where: {email: email}
    });
    // validación de existencia
    if (!credential) {
      throw boom.unauthorized();
    };
    return credential;
  };

  async updateEmail(email) {
    const changes = {
      email: email
    }
    await models.Auth.update({
      ...changes
    });
  };

  async findOne(id) {
    const credential = await models.Auth.findByPk(id);
    if (!credential) {
      throw boom.notFound('credential not found');
    }
    return credential
  };

  async update(id, changes) {
    const credential = await this.findOne(id);
    const answer = await credential.update(changes);
    return answer
  };

};



module.exports = AuthServices
