const Collection = require("../../models/collection");


const changeCollectionInfo = async (req, res) => {
    const {title, tags} = req.body
    const {id} = req.params

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