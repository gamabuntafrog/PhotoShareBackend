const Collection = require("../../models/collection");
const {Conflict, NotFound} = require('http-errors')
const {User} = require("../../models");
const findOutIsCurrentUserAdmin = require('./middlewares/findOutIsCurrentUserAdmin')

const addViewerToCollection = async (req, res) => {
    const {collectionId, viewerId} = req.params
    const {currentUserId} = req

    const collection = await Collection.findById(collectionId)

    if (!collection) {
        throw new NotFound('Collection does not exists')
    }

    if (!findOutIsCurrentUserAdmin(collection.authors, currentUserId)) {
        throw new Conflict('You dont have permission')
    }

    const isViewerAlreadyExists = collection.viewers.some((userId) => userId.toString() === viewerId.toString())

    if (isViewerAlreadyExists) {
        throw new Conflict('User is already viewer')
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
            $push: {
                collections: collectionId
            }
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

    res.status(201).json({
        code: 201,
        status: 'success',
        message: 'Successfully added'
    })
}

module.exports = addViewerToCollection