require('dotenv').config();

const config = {
  env: process.env.NODE_ENV ||'dev',
  isProd: process.env.NODE_ENV === 'production',
  port: process.env.PORT || 3000,
  dbURL: process.env.DATABASE_URL,
  dbDevURL: process.env.DATABASE_DEV_URL,
  jwtsecret: process.env.JWT_SECRET,
  jwtRecovery: process.env.JWT_RECOVERY,
  jwtVerifyEmail: process.env.JWT_VERIFYEMAIL,
  mailuser: process.env.EMAIL_USER,
  mailpassword: process.env.EMAIL_PASSWORD,
  host: process.env.HOST || 'http://localhost:'
}

module.exports = {config}
