const Joi = require("joi");

const register = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required()
})

module.exports = register