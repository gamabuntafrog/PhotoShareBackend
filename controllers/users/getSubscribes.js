const {User} = require('../../models')

const getSubscribes = async (req, res) => {
    const {_id: userId} = req.user

    const {subscribes} = await User.findById(userId).populate({
        path: 'subscribes'
    })

    //
    res.status(200).send({
        code: 200,
        status: 'success',
        data: {
            subscribes
        }
    })
}

module.exports = getSubscribes