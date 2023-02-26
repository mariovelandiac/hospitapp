const { Strategy, ExtractJwt } = require('passport-jwt');
const {config} = require('./../../../config/config');

// ExtractJWT nos permitirá extraer el token del header
// le mandamos opciones

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtsecret,
}

const JwtStrategy = new Strategy(options, (payload, done) => {
  return done(null, payload)
});

module.exports = JwtStrategy
