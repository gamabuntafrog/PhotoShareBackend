const {Post} = require("../../models");


const getMy = async (req, res) => {

    const {_id} = req.user
    const posts = await Post.find({
        author: _id
    }).populate('author')

    res.status(200).json({
        status: 'success',
        code: 200,
        data: {
            posts
        }
    })

}

module.exports = getMy