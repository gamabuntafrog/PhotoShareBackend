const Collection = require("../../models/collection");
const {Conflict, NotFound} = require("http-errors");
const {User} = require("../../models");
const findOutIsCurrentUserAdmin = require("./middlewares/findOutIsCurrentUserAdmin");


const deleteCollection = async (req, res) => {
    const {id: collectionId} = req.params
    const {currentUser, currentUserId} = req

    const collection = await Collection.findById(collectionId)

    if (!collection) {
        throw new NotFound('Collection does not exist')
    }

    if (!findOutIsCurrentUserAdmin(collection.authors, currentUserId)) {
        throw new Conflict('You dont have permission')
    }

    const isUserHasCollection = currentUser.collections.some((id) => id.toString() === collectionId)

    if (!isUserHasCollection) {
        throw new NotFound('User does not have this collection')
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