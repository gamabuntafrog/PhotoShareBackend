const {Collection} = require("../../models");


const getCurrent = async (req, res) => {
    const {user: currentUser} = req
    const {author = false} = req.params
    const {_id: currentUserId} = currentUser

    const params = author ? {path: 'author'} : null

    const collections = await Collection.find({author: '63ac33c7bec2956d03f8e5e6'}).populate(params)

    res.status(200).json({
        status: 'success',
        code: 200,
        data: {
            collections
        }
    })
}

module.exports = getCurrent