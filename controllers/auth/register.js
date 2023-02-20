const {User} = require('../../models')
const bcrypt = require('bcryptjs')
const Joi = require('joi')
const {Conflict} = require('http-errors')
const jwt = require("jsonwebtoken");
const translate = require("../../utils/language/translate");



const register = async (req, res) => {
    const {password, username, email} = req.body
    const {language = ''} = req.headers

    const t = translate(language)

    const isUserExist = await User.findOne({
        $or: [
            {
                username: username,
            },
            {
                email: email
            }
        ]
    })

    if (isUserExist) {
        throw new Conflict(t('userExistsError'))
    }

    const newUser = new User(req.body)
    newUser.setPassword(password)

    const payload = {
        id: newUser._id
    }

    const {SECRET_KEY} = process.env
    const token = jwt.sign(payload, SECRET_KEY, {
        expiresIn: '96h'
    })

    newUser.token = token

    newUser.save()

    res.status(201).send({
        code: 201,
        status: 'success',
        data: {
            user: newUser,
            token: token
        }
    })

}

module.exports = register