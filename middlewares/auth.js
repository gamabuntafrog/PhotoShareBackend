const {Unauthorized} = require('http-errors')
const jwt = require('jsonwebtoken')
const {User} = require('../models')
const translate = require("../utils/language/translate");

const validateJwtVerifyError = (err, decoded) => {
    if (err) throw new Unauthorized("The session is over")
    return decoded
}

const auth = async (req, res, next) => {
    const {authorization = ''} = req.headers
    const [bearer, token] = authorization.split(" ")
    const {language = ''} = req.headers

    const t = translate(language)

    const {SECRET_KEY} = process.env

    try {
        if (bearer !== "Bearer") {
            throw new Unauthorized(t('authError'))
        }

        const {id} = jwt.verify(token, SECRET_KEY, validateJwtVerifyError)

        const user = await User.findById(id)

        if (!user || !user.token) {
            throw new Unauthorized(t('authError'))
        }

        req.user = user
        req.currentUser = user
        req.currentUserId = user._id

        next()
    } catch (e) {
        if (e.message === "Invalid signature") {
            e.code = 401
            e.message = t('invalidSignature')
        }


        throw e
    }
}

module.exports = auth
