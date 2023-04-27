const registerValidationSchema = require('./register')
const loginValidationSchema = require('./login')
const roleValidationSchema = require('./role')

module.exports = {
  registerValidationSchema,
  loginValidationSchema,
  roleValidationSchema
}
