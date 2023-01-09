const Joi = require("joi");
const objectId = Joi.object({
    id: Joi.string().length(24).required(),
    collectionId: Joi.string()
})


const validateObjectId = () => {
    return async (req, res, next) => {
        const {error} = objectId.validate(req.params)

        if (error) {
            error.status = 400;
            next(error)
            return
        }
        next()
    }

}

module.exports = validateObjectId