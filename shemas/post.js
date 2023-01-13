const Joi = require("joi");

const MAX_TITLE_LENGTH = 30
const MIN_TITLE_LENGTH = 0
const MIN_BODY_LENGTH = 0
const MAX_BODY_LENGTH = 200
const MIN_TAGS_LENGTH = 3
const MAX_TAGS_LENGTH = 30
const OBJECT_ID_LENGTH = 24

const REGEX_CHECKING_HASHTAG_PATTERN = /\B#([a-z0-9]{2,})(?![~!@#$%^&*()=+_`\-\|\\/'\[\]\{\}]|[?.,]*\w)/i;

const tagItemValidation = Joi.string().min(MIN_TAGS_LENGTH).max(MAX_TAGS_LENGTH).regex(REGEX_CHECKING_HASHTAG_PATTERN)

const tagsValidation = Joi.array().min(1).items(tagItemValidation).required()

const postValidationObject = {
    title: Joi.string().min(MIN_TITLE_LENGTH).max(MAX_TITLE_LENGTH).required(),
    body: Joi.string().min(MIN_BODY_LENGTH).max(MAX_BODY_LENGTH).required(),
    tags: tagsValidation,
    image: Joi.string().dataUri().required(),
}

const postValidationSchema = Joi.object(postValidationObject)

const addPostValidationScema = Joi.object({
    ...postValidationObject,
    collectionId: Joi.string().required().length(OBJECT_ID_LENGTH),
})

module.exports = {
    postValidationSchema,
    addPostValidationScema,
    tagsValidation,
}