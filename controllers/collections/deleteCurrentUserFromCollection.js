const Collection = require("../../models/collection");
const {Conflict} = require('http-errors')
const {User} = require("../../models");


const deleteCurrentUserFromCollection = async (req, res) => {
    const {currentUserId} = req
    const {collectionId} = req.params

    const collection = await Collection.findById(collectionId)

    const isCurrentUserAuthorOfCollection = collection.authors.some((id) => id.toString() === currentUserId.toString())

    if (!isCurrentUserAuthorOfCollection) {
        throw new Conflict('You dont have permission')
    }

    await Collection.findByIdAndUpdate(collectionId, {
        $pull: {
            authors: currentUserId
        }
    })

    await User.findByIdAndUpdate(currentUserId, {
        $pull: {
            collections: collectionId
        }
    })

    res.status(201).json({
        code: 201,
        status: 'success',
        message: 'Successfully stopped'
    })
}

module.exports = deleteCurrentUserFromCollection