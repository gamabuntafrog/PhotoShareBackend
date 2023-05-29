const { Post, User, Notification } = require('../../models')
const { Conflict } = require('http-errors')
const translate = require('../../utils/language/translate')
const notificationTypes = require('../../utils/notificationTypes')

const like = async (req, res) => {
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

  if (postIfItAlreadyExistsInUser) {
    throw new Conflict(t('postLiked'))
  }

  await Promise.all(
    Post.findByIdAndUpdate(postId, {
      $inc: {
        likesCount: 1
      },
      $push: {
        usersLiked: currentUserId
      }
    }),
    User.findByIdAndUpdate(currentUserId, {
      $push: {
        likedPosts: postId
      }
    })
  )

  if (currentUserId.toString() !== post.author.toString()) {
    await Notification.create({
      userRef: currentUserId,
      receiver: post.author,
      type: notificationTypes.likePost,
      postRef: postId
    })
  }

  res.status(201).json({
    code: 201,
    status: 'success'
  })
}

module.exports = like
