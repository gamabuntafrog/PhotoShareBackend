const Collection = require("../../models/collection");
const {Conflict, NotFound} = require("http-errors");
const {User} = require("../../models");


const deleteCollection = async (req, res) => {
    const {id: collectionId} = req.params
    const {user: currentUser} = req

    const isCollectionExists = !!await Collection.findById(collectionId)

    if (!isCollectionExists) {
        throw new NotFound('collection no exists')
    }

    const isUserHasCollection = currentUser.collections.some((id) => id.toString() === collectionId)

    if (!isUserHasCollection) {
        throw new NotFound('user does not have this collection')
    }

    // delete from user

    await User.findByIdAndUpdate(currentUser._id, {
        $pull: {
            collections: collectionId
        }
    })

    // delete collection

    await Collection.findByIdAndDelete(collectionId)

    res.status(201).json({
        code: 201,
        status: 'success',
        message: 'Successfully deleted'
    })
}

module.exports = deleteCollection