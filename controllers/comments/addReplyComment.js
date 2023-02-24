const {Comment, SubComment, Post} = require("../../models");
const {NotFound} = require("http-errors");


const addReplyComment = async (req, res) => {

    const {postId, commentId} = req.params
    const {text, receiverId} = req.body
    const {currentUserId} = req

    const post = await Post.findById(postId)

    if (!post) {
        throw new NotFound('Posts no exists')
    }

    const subComment = await SubComment.create({
        text,
        author: currentUserId,
        receiver: receiverId,
        commentRef: commentId,
        postRef: postId
    })

    await Comment.findByIdAndUpdate(commentId, {
        $push: {
            replies: subComment._id
        }
    })

    res.status(201).send({
        code: 201,
        status: 'success'
    })
}

module.exports = addReplyComment