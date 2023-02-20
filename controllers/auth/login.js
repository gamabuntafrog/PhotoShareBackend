const {BadRequest} = require('http-errors')
const jwt = require("jsonwebtoken")
const {User} = require('../../models')
const translate = require("../../utils/language/translate");

const login = async (req, res) => {
    const {SECRET_KEY} = process.env

    const {email, password} = req.body
    const user = await User.findOne({email})
    const {language = ''} = req.headers

    const t = translate(language)

    if (!user || !user.comparePassword(password)) {
        throw new BadRequest(t('emailOrPasswordWrong'))
    }

    const payload = {
        id: user._id
    }
    const token = jwt.sign(payload, SECRET_KEY, {
        expiresIn: '7d'
    })

    user.token = token
    await user.save()

    res.status(200).send({
        code: 200,
        status: 'success',
        data: {
            token
        }
    })
}

module.exports = login