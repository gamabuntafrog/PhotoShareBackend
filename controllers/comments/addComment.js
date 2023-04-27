const { Comment, Post, Notification } = require('../../models')
const { NotFound } = require('http-errors')
const notificationTypes = require('../../utils/notificationTypes')
const translate = require('../../utils/language/translate')

const addComment = async (req, res) => {
  const { id: postId } = req.params
  const { currentUserId, currentUser } = req
  const { text } = req.body
  const { language = '' } = req.headers

  const t = translate(language)

  const post = await Post.findById(postId)

  if (!post) {
    throw new NotFound(t('postNotFound'))
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
    author: { _id: currentUserId, avatar: currentUser.avatar.url, username: currentUser.username },
    replies: [],
    text: text
  }

  if (post.author.toString() !== currentUserId) {
    await Notification.create({
      userRef: currentUserId,
      receiver: post.author,
      type: notificationTypes.addCommentToPost,
      postRef: post._id,
      commentRef: comment._id
    })
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
