const {Comment, Post} = require('../../models')
const {NotFound} = require('http-errors')

const addComment = async (req, res) => {
    const {id: postId} = req.params
    const {currentUserId, currentUser} = req
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

    const validatedComment = {
        _id: comment._id,
        author: {_id: currentUserId, avatar: currentUser.avatar.url, username: currentUser.username},
        replies: [],
        text: text
    }

    res.status(201).json({
        code: 201,
        status: 'success',
        data: {
            comment: validatedComment
        }
    })
}

module.exports = addComment