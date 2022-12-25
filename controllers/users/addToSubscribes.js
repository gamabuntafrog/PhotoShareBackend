const {User, Notification} = require('../../models')
const {NotFound, Conflict} = require('http-errors')
const emitter = require("../../emitter");



const addToSubscribes = async (req, res) => {
    const {id: userId} = req.params
    const {_id: currentUserId} = req.user

    const userIfHeExists = await User.findById(userId)
    if (!userIfHeExists) {
        throw new NotFound('user no exists')
    }

    const userIfHeIsAlreadyInSubscribes = req.user.subscribes.find(({_id}) => _id.toString() === userId) || null
    if (userIfHeIsAlreadyInSubscribes) {
        throw new Conflict('user already in subscribes')
    }

    const subscriber = await User.findByIdAndUpdate(currentUserId, {
        $push: {
            subscribes: userId
        }
    })

    const user = await User.findByIdAndUpdate(userId, {
        $push: {
            subscribers: currentUserId
        }
    })

    const notification = {
        type: 'subscribe',
        user: currentUserId,
        receiver: userId
    }

    const newNotification = await Notification.create(notification)

    emitter.emit(`newNotification/${userId}`, newNotification)

    res.status(201).json({
        code: 201,
        status: 'success',
        data: {
            user: userIfHeExists
        }
    })
}

module.exports = addToSubscribes