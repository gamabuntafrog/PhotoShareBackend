const {User} = require("../../models");


const getAll = async (req, res) => {
    const {username} = req.query



    const users = await User.find()

    res.status(200).send({
        code: 200,
        status: 'success',
        data: {
            users
        }
    })
}

module.exports = getAll