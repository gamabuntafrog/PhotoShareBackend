const {BadRequest} = require('http-errors')
const jwt = require("jsonwebtoken")
const {User} = require('../../models')

const login = async (req, res) => {
    const {SECRET_KEY} = process.env

    const {email, password} = req.body
    const user = await User.findOne({email})
    // throw new BadRequest("Email or password is wrong")

    if (!user || !user.comparePassword(password)) {
        throw new BadRequest("Email or password is wrong")
    }

    const payload = {
        id: user._id
    }
    const token = jwt.sign(payload, SECRET_KEY, {
        expiresIn: '1s'
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