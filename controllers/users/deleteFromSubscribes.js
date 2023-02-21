const {User, Notification} = require("../../models");
const {Conflict} = require("http-errors");
const translate = require("../../utils/language/translate");
const notificationTypes = require("../../utils/notificationTypes");


const deleteFromSubscribes = async (req, res) => {
    const {id: userId} = req.params
    const {_id: currentUserId} = req.user
    const {language = ''} = req.headers

    const t = translate(language)

    const userIfHeIsAlreadyInSubscribes = req.user.subscribes.find(({_id}) => _id.toString() === userId) || null
    if (!userIfHeIsAlreadyInSubscribes) {
        throw new Conflict(t('userAlreadyNotInSubscribers'))
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

    await Notification.create({
        userRef: currentUserId,
        receiver: userId,
        type: notificationTypes.unsubscribe
    })

    res.status(204).send()
}

module.exports = deleteFromSubscribes