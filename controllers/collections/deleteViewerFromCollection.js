const Collection = require("../../models/collection");
const {Conflict} = require('http-errors')
const {User} = require("../../models");
const findOutIsCurrentUserAdmin = require('./middlewares/findOutIsCurrentUserAdmin')
const translate = require("../../utils/language/translate");

const deleteViewerFromCollection = async (req, res) => {
    const {collectionId, viewerId} = req.params
    const {currentUserId} = req
    const {language = ''} = req.headers

    const t = translate(language)
    const collection = await Collection.findById(collectionId)

    if (!collection) {
        throw new NotFound('Collection does not exists')
    }

    if (!findOutIsCurrentUserAdmin(collection.authors, currentUserId)) {
        throw new Conflict('You dont have permission')
    }

    const isViewerAlreadyExists = collection.viewers.some((userId) => userId.toString() === viewerId.toString())

    if (!isViewerAlreadyExists) {
        throw new Conflict('User is not already viewer')
    }

    await Collection.findByIdAndUpdate(collectionId, {
        $pull: {
            viewers: viewerId
        }
    })

    await User.findByIdAndUpdate(viewerId, {
        $pull: {
            allowedToViewCollections: collectionId
        }
    })

    res.status(201).json({
        code: 201,
        status: 'success',
        message: 'Successfully deleted'
    })
}

module.exports = deleteViewerFromCollection