const {Notification} = require('../../models')
const notificationTypes = require("../../utils/notificationTypes");


const getAll = async (req, res) => {
    const {currentUserId} = req

    const notifications = await Notification.find({receiver: currentUserId})
        .populate('userRef',).populate('postRef').populate('collectionRef')

    const validatedNotifications = notifications.map((notification) => {
        const {type, checked, receiver, userRef, postRef = null, collectionRef = null} = notification
        const {username, avatar: {url}, _id} = userRef

        const user = typeof userRef === 'string' ? {_id: userRef} : {_id, username, avatarURL: url}

        if (type === notificationTypes.subscribe || type === notificationTypes.unsubscribe) {
            return {checked, type, user}
        }

        if (type === notificationTypes.likePost || type === notificationTypes.unlikePost) {

            const post = postRef ?
                typeof postRef === 'string' ? {_id: postRef} : {
                    _id: postRef._id,
                    image: postRef.image.url
                } : null

            return {checked, type, user, post}
        }

        return notification
    })

    res.status(200).json({
        code: 200,
        status: 'success',
        data: {
            notifications: validatedNotifications
        }
    })
}

module.exports = getAll