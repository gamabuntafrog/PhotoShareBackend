const Collection = require("../../models/collection");
const {Conflict, NotFound} = require("http-errors");
const {User} = require("../../models");
const findOutIsCurrentUserAdmin = require("./middlewares/findOutIsCurrentUserAdmin");


const deleteCollection = async (req, res) => {
    const {id: collectionId} = req.params
    const {currentUserId} = req

    const collection = await Collection.findById(collectionId)

    if (!collection) {
        throw new NotFound('Collection does not exist')
    }

    if (!findOutIsCurrentUserAdmin(collection.authors, currentUserId)) {
        throw new Conflict('You dont have permission')
    }

    await Collection.findByIdAndDelete(collectionId)

    await User.findByIdAndUpdate(currentUserId, {
        $pull: {
            collections: collectionId
        }
    })


    res.status(201).json({
        code: 201,
        status: 'success',
        message: 'Successfully deleted'
    })
}

module.exports = deleteCollection