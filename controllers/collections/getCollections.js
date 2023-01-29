const {Collection} = require("../../models");


const getCollections = async (req, res) => {
    const {currentUserId} = req

    const collections = await Collection.find({
        $or: [{isPrivate: false}, {viewers: [currentUserId]}, {'authors.user': currentUserId}]
    }).limit(50)

    res.status(200).json({
        status: 'success',
        code: 200,
        data: {
            collections
        }
    })
}

module.exports = getCollections