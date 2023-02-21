const {User, Notification} = require('../../models')
const {NotFound, Conflict} = require('http-errors')
const translate = require("../../utils/language/translate");
const notificationTypes = require('../../utils/notificationTypes')


const addToSubscribes = async (req, res) => {
    const {id: userId} = req.params
    const {_id: currentUserId} = req.user
    const {language = ''} = req.headers

    const t = translate(language)

    const userIfHeExists = await User.findById(userId)
    if (!userIfHeExists) {
        throw new NotFound(t('userDoesNotExist'))
    }

    const userIfHeIsAlreadyInSubscribes = req.user.subscribes.find(({_id}) => _id.toString() === userId) || null
    if (userIfHeIsAlreadyInSubscribes) {
        throw new Conflict(t('userAlreadyInSubscribers'))
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

    await Notification.create({
        userRef: currentUserId,
        receiver: userId,
        type: notificationTypes.subscribe
    })

    res.status(204).send()
}

module.exports = addToSubscribes