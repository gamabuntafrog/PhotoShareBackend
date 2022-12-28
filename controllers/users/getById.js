const {User} = require("../../models");


const getById = async (req, res) => {

    const {id} = req.params
    const {posts} = req.query

    const dbParams = posts ? {
        path: 'posts',
        options: {
            sort: {createdAt: -1}
        }
    } : null

    const user = await User.findById(id).populate(dbParams)

    res.status(200).json({
        code: 200,
        status: 'success',
        data: {
            user
        }
    })
}
//
module.exports = getById