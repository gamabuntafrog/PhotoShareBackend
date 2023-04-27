const Joi = require('joi')

module.exports = roleValidationSchema = Joi.object({
  role: Joi.alternatives().try('AUTHOR', 'ADMIN')
})
