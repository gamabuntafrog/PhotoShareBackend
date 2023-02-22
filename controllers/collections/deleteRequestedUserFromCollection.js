const Collection = require("../../models/collection");
const {Conflict, NotFound} = require('http-errors')
const {User, Notification} = require("../../models");
const findOutIsCurrentUserAdmin = require('./middlewares/findOutIsCurrentUserAdmin')
const translate = require("../../utils/language/translate");
const notificationTypes = require("../../utils/notificationTypes");

const deleteRequestedUserFromCollection = async (req, res) => {
    const {collectionId, userId} = req.params
    const {currentUserId} = req
    const {language = ''} = req.headers

    const t = translate(language)
    const collection = await Collection.findById(collectionId)

    if (!collection) {
        throw new NotFound(t('collectionNotFound'))
    }

    if (!findOutIsCurrentUserAdmin(collection.authors, currentUserId)) {
        throw new Conflict(t('dontHavePermission'))
    }

    const isViewerAlreadyExists = collection.requests.some((id) => id.toString() === userId.toString())

    if (!isViewerAlreadyExists) {
        throw new Conflict('userAlreadyViewer')
    }

    await Collection.findByIdAndUpdate(collectionId, {
        $pull: {
            requests: userId
        }
    })

    await Notification.create({
        userRef: currentUserId,
        receiver: userId,
        type: notificationTypes.declineJoinToCollectionRequest,
        collectionRef: collectionId
    })

    res.status(201).json({
        code: 201,
        status: 'success',
        message: t('successfullyDeleted')
    })
}

module.exports = deleteRequestedUserFromCollection