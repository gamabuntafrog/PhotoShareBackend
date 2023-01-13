const Joi = require("joi");

const MIN_USERNAME_LENGTH = 4
const MAX_USERNAME_LENGTH = 20
const MIN_PASSWORD_LENGTH = 6
const MAX_PASSWORD_LENGTH = 50


const registerValidationSchema = Joi.object({
    username: Joi.string().min(MIN_USERNAME_LENGTH).max(MAX_USERNAME_LENGTH).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(MIN_PASSWORD_LENGTH).max(MAX_PASSWORD_LENGTH).required()
})

module.exports = registerValidationSchema