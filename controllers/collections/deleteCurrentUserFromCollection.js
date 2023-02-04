const Collection = require("../../models/collection");
const {Conflict, NotFound} = require('http-errors')
const {User} = require("../../models");


const deleteCurrentUserFromCollection = async (req, res) => {
    const {currentUserId} = req
    const {collectionId} = req.params

    const collection = await Collection.findById(collectionId)

    if (!collection) {
        throw new NotFound('Collection does not exists')
    }

    const isCurrentUserAuthorOfCollection = collection.authors.some(({user: userId}) => userId.toString() === currentUserId.toString())

    const isCurrentUserViewerOfCollection = collection.viewers.some((userId) => userId.toString() === currentUserId.toString())

    if (!isCurrentUserAuthorOfCollection && !isCurrentUserViewerOfCollection) {
        throw new Conflict('You dont have permission')
    }

    if (isCurrentUserAuthorOfCollection) {
        await Collection.findByIdAndUpdate(collectionId, {
            $pull: {
                authors: {
                    user: currentUserId
                }
            }
        })

        await User.findByIdAndUpdate(currentUserId, {
            $pull: {
                collections: collectionId
            }
        })
    } else {
        await Collection.findByIdAndUpdate(collectionId, {
            $pull: {
                viewers: currentUserId
            }
        })

        await User.findByIdAndUpdate(currentUserId, {
            $pull: {
                allowedToViewCollections: collectionId
            }
        })
    }


    res.status(202).json({
        code: 202,
        status: 'success',
        message: 'Successfully leaved'
    })
}

module.exports = deleteCurrentUserFromCollection