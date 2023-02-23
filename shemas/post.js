const Joi = require("joi");
const {MIN_TAGS_LENGTH, MAX_TAGS_LENGTH, MIN_TITLE_LENGTH, MAX_TITLE_LENGTH, MAX_BODY_LENGTH, MIN_BODY_LENGTH,
    OBJECT_ID_LENGTH, MIN_USERNAME_LENGTH, MAX_USERNAME_LENGTH
} = require("./variables");


const REGEX_CHECKING_HASHTAG_PATTERN = /\B#([a-z0-9]{2,})(?![~!@#$%^&*()=+_`\-\|\\/'\[\]\{\}]|[?.,]*\w)/i;

const tagItemValidation = Joi.string().min(MIN_TAGS_LENGTH).max(MAX_TAGS_LENGTH).regex(REGEX_CHECKING_HASHTAG_PATTERN)

const tagsValidation = Joi.array().min(1).items(tagItemValidation).required()

const tagsValidationSchema = Joi.object({
    tagsValidation
})

const postValidationObject = {
    title: Joi.string().min(MIN_TITLE_LENGTH).max(MAX_TITLE_LENGTH).required(),
    body: Joi.string().min(MIN_BODY_LENGTH).max(MAX_BODY_LENGTH).required(),
    tags: tagsValidation,
    image: Joi.string().dataUri().required(),
}

const postValidationSchema = Joi.object(postValidationObject)

const addPostValidationSchema = Joi.object({
    ...postValidationObject,
    collectionId: Joi.string().required().length(OBJECT_ID_LENGTH),
})

module.exports = {
    postValidationSchema,
    addPostValidationSchema,
    tagsValidation,
    tagsValidationSchema
}