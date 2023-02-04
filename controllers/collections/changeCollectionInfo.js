const Collection = require("../../models/collection");
const findOutIsCurrentUserAdmin = require("./middlewares/findOutIsCurrentUserAdmin");
const {Conflict, NotFound} = require("http-errors");


const changeCollectionInfo = async (req, res) => {
    const {title, tags} = req.body
    const {currentUserId} = req
    const {id} = req.params

    const collection = await Collection.findById(id)

    if (!collection) {
        throw new NotFound('Collection does not exist')
    }

    if (!findOutIsCurrentUserAdmin(collection.authors, currentUserId)) {
        throw new Conflict('You dont have permission')
    }

    await Collection.findByIdAndUpdate(id, {
        title,
        tags
    })

    res.status(202).json({
        status: 'success',
        code: 202,
        message: 'Successfully changed'
    })
}

module.exports = changeCollectionInfo