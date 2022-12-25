const {Post} = require('../../models')

const findOneById = async (req, res) => {

    const post = await Post.findById(req.params.id).populate({
        path: 'comments',
        populate: {
            path: 'replies'
        }
    })

    res.status(200).send({
        code: 200,
        status: 'success',
        data: {
            post
        }
    })
}

module.exports = findOneById