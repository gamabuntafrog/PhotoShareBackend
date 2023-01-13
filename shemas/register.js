const Joi = require("joi");
const {MIN_USERNAME_LENGTH, MIN_PASSWORD_LENGTH, MAX_USERNAME_LENGTH, MAX_PASSWORD_LENGTH} = require("./variables");




const registerValidationSchema = Joi.object({
    username: Joi.string().min(MIN_USERNAME_LENGTH).max(MAX_USERNAME_LENGTH).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(MIN_PASSWORD_LENGTH).max(MAX_PASSWORD_LENGTH).required()
})

module.exports = registerValidationSchema