const {Comment, SubComment, Post, User} = require("../../models");
const {NotFound} = require("http-errors");


const addReplyComment = async (req, res) => {

    const {postId, commentId} = req.params
    const {text, receiverId} = req.body
    const {currentUserId, currentUser} = req

    const post = await Post.findById(postId)

    if (!post) {
        throw new NotFound('Posts no exists')
    }

    const receiver = await User.findById(receiverId)

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

    const validatedReply = {
        _id: subComment._id,
        author: {_id: currentUserId, avatar: currentUser.avatar.url, username: currentUser.username},
        receiver: {
            _id: receiverId, avatar: receiver.avatar.url, username: receiver.username
        },
        text: text,
    }

    res.status(201).json({
        code: 201,
        status: 'success',
        data: {
            reply: validatedReply
        }
    })
}

module.exports = addReplyComment