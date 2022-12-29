const {User} = require("../../models");


const getById = async (req, res) => {

    const {id} = req.params
    const {posts, collections} = req.query

    const collectionsParams = collections ? {
        path: 'collections',
        options: {
            sort: {createdAt: -1}
        },
        populate: {
            path: 'posts',
            options: {
                sort: {createdAt: -1},
                limit: 3
            },
        }
    } : null

    const user = await User.findById(id).populate(collectionsParams)

    res.status(200).json({
        code: 200,
        status: 'success',
        data: {
            user
        }
    })
}

module.exports = getById