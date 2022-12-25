const emitter = require("../../emitter");


const getOne = async (req, res) => {
    const {_id: userId} = req.user

    emitter.once(`newNotification/${userId}`, (notification) => {
        res.status(200).json({
            code: 200,
            status: 'success',
            data: {
                notification: notification
            }
        })
    })
}

module.exports = getOne

