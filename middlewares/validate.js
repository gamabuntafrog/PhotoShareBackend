


const validate = (schema) => {
    return async (req, res, next) => {
        const {error} = schema.validate(req.body)

        if (error) {
            error.status = 400;
            next(error)
            return
        }
        next()
    }

}

module.exports = validate