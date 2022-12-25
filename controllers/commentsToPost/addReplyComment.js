const {Comment, SubComment} = require("../../models");


const addReplyComment = async (req, res) => {

    const {id} = req.params
    const {_id: userId} = req.user


    const subComment = new SubComment({
        ...req.body,
        author: userId
    })

    const comment = await Comment.findByIdAndUpdate(id, {
        $push: {
            replies: subComment._id
        }
    })

    if (comment) {
        await subComment.save()
    }


    res.json({
        status: "success",
        data: comment
    })
}

module.exports = addReplyComment