const {Comment, SubComment} = require("../../models");
const {Conflict} = require("http-errors");
const translate = require("../../utils/language/translate");

const deleteReply = async (req, res) => {
    const {replyId} = req.params
    const {currentUserId} = req
    const {language = ''} = req.headers

    const t = translate(language)
    const reply = await SubComment.findById(replyId)

    console.log(reply.author.toString())
    console.log(currentUserId.toString())

    if (reply.author.toString() !== currentUserId.toString()) {
        throw new Conflict(t('youAreNotAuthor'))
    }

    await SubComment.findByIdAndDelete(replyId)

    res.status(202).json({
        status: 'success',
        code: 202
    })
}

module.exports = deleteReply