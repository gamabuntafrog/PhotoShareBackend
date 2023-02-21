const validateRole = (schema) => {
    return async (req, res, next) => {
        const {error} = schema.validate(req.query)

        if (error) {
            const err = {message: t('roleError'), statusCode: 400, status: 'error'}

            next(err)
            return
        }
        next()
    }

}

module.exports = validateRole