const {Notification} = require('../../models')


const getAll = async (req, res) => {
    const {_id: userId} = req.user
    const {users} = req.query

    const dbParams = users ? {
        path: 'user'
    } : null

    console.log(users)
    const notifications = await Notification.find({receiver: userId}).populate({
        path: 'user',
    })

    res.status(200).json({
        code: 200,
        status: 'success',
        data: {
            notifications
        }
    })
}

module.exports = getAll