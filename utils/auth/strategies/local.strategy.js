const {Strategy} = require('passport-local');
const AuthService = require('./../../../api/services/auth.services');
const service = new AuthService();

// lógica de negocio para la autenticación
const LocalStrategy = new Strategy({
  usernameField: 'email',
  passwordField: 'password'
  },
  async (email, password, done) => {
    try {
      const user = await service.getCredential(email, password); // para continuar con la estragegia la credencial tomará el nombre de user
      done(null, user)
    } catch (e) {
      done(e, false)
    }
  }
);

module.exports = LocalStrategy
