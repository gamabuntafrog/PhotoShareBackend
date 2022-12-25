const {Comment, Post} = require('../../models')
const {NotFound} = require('http-errors')

const addComment = async (req, res) => {
    const {id: postId} = req.params
    const {_id: userId} = req.user

    const post = await Post.findById(postId)

    if (!post) {
        throw new NotFound('Posts no exists')
    }

    const addedComment = await Comment.create({
        ...req.body,
        author: userId
    })

    await Post.findByIdAndUpdate(postId, {
        $push: {
            comments: addedComment._id
        }
    })

    res.status(201).send({
        code: 201,
        status: 'success',
        data: {
            addedComment
        }
    })
}

module.exports = addComment