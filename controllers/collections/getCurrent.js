const {Collection} = require("../../models");


const getCurrent = async (req, res) => {
    const {currentUserId} = req

    const collections = await Collection.find({
        authors: {
            $in: [currentUserId]
        }
    })

    res.status(200).json({
        status: 'success',
        code: 200,
        data: {
            collections
        }
    })
}

module.exports = getCurrent