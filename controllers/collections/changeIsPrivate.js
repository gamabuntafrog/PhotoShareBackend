const findOutIsCurrentUserAdmin = require("./middlewares/findOutIsCurrentUserAdmin");
const {Conflict, NotFound} = require("http-errors");
const Collection = require("../../models/collection");


const changeIsPrivate = async (req, res) => {

    const {currentUserId} = req
    const {id: collectionId} = req.params

    const collection = await Collection.findById(collectionId)

    if (!collection) {
        throw new NotFound('Collection does not exist')
    }

    if (!findOutIsCurrentUserAdmin(collection.authors, currentUserId)) {
        throw new Conflict('You dont have permission')
    }

    await Collection.findByIdAndUpdate(collectionId, {
        isPrivate: !collection.isPrivate
    })

    res.status(202).json({
        status: 'success',
        code: 202,
        message: 'Success'
    })
}

module.exports = changeIsPrivate