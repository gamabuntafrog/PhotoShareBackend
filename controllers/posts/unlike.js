const { Conflict } = require('http-errors')
const { Post, User, Notification } = require('../../models')
const translate = require('../../utils/language/translate')
const notificationTypes = require('../../utils/notificationTypes')

const unlike = async (req, res) => {
  const { id: postId } = req.params
  const { currentUserId } = req
  const { language = '' } = req.headers

  const t = translate(language)
  const post = await Post.findById(postId)

  if (!post) {
    throw new Conflict(t('postNotFound'))
  }

  const postIfItAlreadyExistsInUser = req.user.likedPosts.find(
    ({ _id }) => _id.toString() === postId
  )

  if (!postIfItAlreadyExistsInUser) {
    throw new Conflict(t('postNotLiked'))
  }

  await Promise.all([
    Post.findByIdAndUpdate(postId, {
      $inc: {
        likesCount: -1
      },
      $pull: {
        usersLiked: currentUserId
      }
    }),
    User.findByIdAndUpdate(currentUserId, {
      $pull: {
        likedPosts: postId
      }
    })
  ])

  if (currentUserId.toString() !== post.author.toString()) {
    await Notification.create({
      userRef: currentUserId,
      receiver: post.author,
      type: notificationTypes.unlikePost,
      postRef: postId
    })
  }

  res.status(201).json({
    code: 201,
    status: 'success'
  })
}

module.exports = unlike
