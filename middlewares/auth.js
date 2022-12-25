const {Unauthorized} = require('http-errors')
const jwt = require('jsonwebtoken')
const {User} = require('../models')

const auth = async (req, res, next) => {
    const {authorization = ''} = req.headers
    const [bearer, token] = authorization.split(" ")

    const {SECRET_KEY} = process.env

    try {
        if (bearer !== "Bearer") {
            throw new Unauthorized("Not authorized")
        }

        const {id} = jwt.verify(token, SECRET_KEY)
        const user = await User.findById(id)

        if (!user || !user.token) {
            throw new Unauthorized("Not authorized")
        }

        req.user = user

        next()
    } catch (e) {
        if (e.message === "Invalid signature") {
            e.status = 401
        }

        throw e
    }

}

module.exports = auth
