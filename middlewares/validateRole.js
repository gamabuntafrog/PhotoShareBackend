const validateRole = (schema) => {
    return async (req, res, next) => {
        const {error} = schema.validate(req.query)

        if (error) {
            console.log(error.details)

            const err = {message: 'Invalid role', statusCode: 400, status: 'error'}

            next(err)
            return
        }
        next()
    }

}

module.exports = validateRole