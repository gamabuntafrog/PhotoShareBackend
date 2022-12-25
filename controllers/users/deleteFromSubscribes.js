const {User, Notification} = require("../../models");
const {Conflict} = require("http-errors");
const emitter = require("../../emitter");


const deleteFromSubscribes = async (req, res) => {
    const {id: userId} = req.params
    const {_id: currentUserId} = req.user

    const userIfHeIsAlreadyInSubscribes = req.user.subscribes.find(({_id}) => _id.toString() === userId) || null
    if (!userIfHeIsAlreadyInSubscribes) {
        throw new Conflict('user already not in subscribes')
    }

    const subscriber = await User.findByIdAndUpdate(currentUserId, {
        $pull: {
            subscribes: userId
        }
    })

    const user = await User.findByIdAndUpdate(userId, {
        $pull: {
            subscribers: currentUserId
        }
    })

    const notification = {
        type: 'unsubscribe',
        user: currentUserId,
        receiver: userId
    }

    const newNotification = await Notification.create(notification)

    emitter.emit(`newNotification/${userId}`, newNotification)

    res.status(204).send()

}

module.exports = deleteFromSubscribes