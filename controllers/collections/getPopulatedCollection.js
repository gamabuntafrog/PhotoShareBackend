const {Collection} = require("../../models");


const getPopulatedCollection = async (req, res) => {
    const {id: collectionId} = req.params

    const collection = await Collection.findById(collectionId).populate('author').populate({
        path: 'posts',
        options: {
            sort: {createdAt: -1}
        },
        populate: 'author'
    })

    res.status(200).json({
        satus: 'success',
        code: 200,
        data: {
            collection
        }
    })
}

module.exports = getPopulatedCollection