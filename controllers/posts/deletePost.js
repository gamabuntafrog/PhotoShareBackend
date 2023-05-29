const Post = require('../../models/post')
const { User } = require('../../models')
const { Conflict } = require('http-errors')
const translate = require('../../utils/language/translate')

const deletePost = async (req, res) => {
  const { id: postId } = req.params
  const { user: currentUser } = req
  const { language = '' } = req.headers

  const t = translate(language)

  const isCurrentUserAuthorOfPost = currentUser.posts.some((_id) => _id.toString() === postId)

  if (!isCurrentUserAuthorOfPost) {
    throw new Conflict(t('userAlreadyNotAuthor'))
  }

  await Promise.all([
    User.findByIdAndUpdate(currentUser._id, {
      $pull: {
        posts: postId
      }
    }),
    Post.findByIdAndDelete(postId)
  ])

  res.status(202).json({
    code: 202,
    status: 'success',
    message: t('postDeleted')
  })
}

module.exports = deletePost
