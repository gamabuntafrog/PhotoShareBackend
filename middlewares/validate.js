const validate = (schema) => {
    return async (req, res, next) => {
        const {error} = schema.validate(req.body)

        if (error) {
            console.log(error.details)

            const err = {message: 'Validation error', statusCode: 400, status: 'error'}

            next(err)
            return
        }
        next()
    }

}

module.exports = validate