const Joi = require("joi");
const {tagsValidation} = require("./post");

const MIN_TITLE_LENGTH = 3
const MAX_TITLE_LENGTH = 48

const collectionValidationSchema = Joi.object({
    title: Joi.string().min(MIN_TITLE_LENGTH).max(MAX_TITLE_LENGTH).required(),
    tags: tagsValidation
})

module.exports = {
    collectionValidationSchema
}