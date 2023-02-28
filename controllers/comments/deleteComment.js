const {Comment, SubComment} = require("../../models");
const {Conflict} = require("http-errors");
const translate = require("../../utils/language/translate");

const deleteComment = async (req, res) => {
    const {commentId} = req.params
    const {currentUserId} = req
    const {language = ''} = req.headers

    const t = translate(language)
    const comment = await Comment.findById(commentId)

    if (comment.author.toString() !== currentUserId.toString()) {
        throw new Conflict(t('youAreNotAuthor'))
    }

    await Comment.findByIdAndDelete(commentId)

    res.status(202).json({
        status: 'success',
        code: 202
    })
}

module.exports = deleteComment