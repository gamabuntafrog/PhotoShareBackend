const Joi = require("joi");
const {MIN_USERNAME_LENGTH, MAX_USERNAME_LENGTH} = require("./variables");

const updateUserValidationSchema = Joi.object({
    username: Joi.string().min(MIN_USERNAME_LENGTH).max(MAX_USERNAME_LENGTH).required(),
    avatar: Joi.string().dataUri().allow(''),
})

module.exports = {
    updateUserValidationSchema
}