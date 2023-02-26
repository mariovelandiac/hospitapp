const passport = require('passport');
// estrategias de autenticación para API: local y JWT
const LocalStrategy = require('./strategies/local.strategy')
const JwtStrategy = require('./strategies/jwt.strategy')

passport.use(LocalStrategy);
passport.use(JwtStrategy);

