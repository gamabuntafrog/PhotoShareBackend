const Collection = require("../../models/collection");
const {Conflict, NotFound} = require('http-errors')
const {User, Notification} = require("../../models");
const findOutIsCurrentUserAdmin = require('./middlewares/findOutIsCurrentUserAdmin')
const translate = require("../../utils/language/translate");
const notificationTypes = require("../../utils/notificationTypes");

const addViewerToCollection = async (req, res) => {
    const {collectionId, viewerId} = req.params
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

    const isViewerAlreadyExists = collection.viewers.some((userId) => userId.toString() === viewerId.toString())

    if (isViewerAlreadyExists) {
        throw new Conflict(t('userAlreadyViewer'))
    }

    const isViewerAlreadyAuthor = collection.authors.some(({user: userId}) => userId.toString() === viewerId.toString())

    if (isViewerAlreadyAuthor) {
        await Collection.findByIdAndUpdate(collectionId, {
            $pull: {
                authors: {
                    user: viewerId
                }
            }
        })

        await User.findByIdAndUpdate(viewerId, {
            $pull: {
                collections: collectionId
            }
        })

        await Notification.create({
            userRef: currentUserId,
            receiver: viewerId,
            type: notificationTypes.changeUserRoleInCollection,
            collectionRef: collectionId
        })
    }

    const isUserAlreadyInQueue = collection.requests.some((userId) => userId.toString() === viewerId.toString())
    if (isUserAlreadyInQueue) {
        await Collection.findByIdAndUpdate(collectionId, {
            $pull: {
                requests: viewerId
            }
        })
        await Notification.create({
            userRef: currentUserId,
            receiver: viewerId,
            type: notificationTypes.acceptJoinToCollectionRequest,
            collectionRef: collectionId
        })
    }

    await Collection.findByIdAndUpdate(collectionId, {
        $push: {
            viewers: viewerId
        }
    })

    await User.findByIdAndUpdate(viewerId, {
        $push: {
            allowedToViewCollections: collectionId
        }
    })

    if (!isViewerAlreadyExists && !isViewerAlreadyAuthor && !isUserAlreadyInQueue) {
        await Notification.create({
            userRef: currentUserId,
            receiver: viewerId,
            type: notificationTypes.addUserToCollection,
            collectionRef: collectionId
        })
    }

    res.status(201).json({
        code: 201,
        status: 'success',
        message: t('roleAdded')
    })
}

module.exports = addViewerToCollection