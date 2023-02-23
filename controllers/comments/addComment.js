const {Comment, Post} = require('../../models')
const {NotFound} = require('http-errors')

const addComment = async (req, res) => {
    const {id: postId} = req.params
    const {currentUserId} = req
    const {text} = req.body

    const post = await Post.findById(postId)

    if (!post) {
        throw new NotFound('Posts no exists')
    }

    const comment = await Comment.create({
        text,
        author: currentUserId,
        postRef: postId
    })

    await Post.findByIdAndUpdate(postId, {
        $push: {
            comments: comment._id
        }
    })

    res.status(201).send({
        code: 201,
        status: 'success'
    })
}

module.exports = addComment