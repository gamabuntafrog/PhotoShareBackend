const Joi = require("joi");

const MIN_PASSWORD_LENGTH = 6
const MAX_PASSWORD_LENGTH = 50


const loginValidationSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(MIN_PASSWORD_LENGTH).max(MAX_PASSWORD_LENGTH).required()
})

module.exports = loginValidationSchema