const {Comment, SubComment} = require("../../models");
const {Conflict} = require("http-errors");

const deleteComment = async (req, res) => {
    const {commentId} = req.params
    const {currentUserId} = req

    const comment = await Comment.findById(commentId)

    if (comment.author.toString() !== currentUserId.toString()) {
        throw new Conflict('You are not the author')
    }

    await Comment.findByIdAndDelete(commentId)

    res.status(202).json({
        status: 'success',
        code: 202
    })
}

module.exports = deleteComment