const translate = require('../utils/language/translate')
const validate = (schema) => {
  return async (req, res, next) => {
    const { language = '' } = req.headers

    const t = translate(language)

    const { error } = schema.validate(req.body)

    if (error) {
      const err = { message: t('validationError'), statusCode: 400, status: 'error' }

      next(err)
      return
    }
    next()
  }
}

module.exports = validate
