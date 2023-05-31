const { Conflict, NotFound } = require('http-errors')
const { Post, User, Collection } = require('../../models')
const translate = require('../../utils/language/translate')

const deletePostFromCollection = async (req, res) => {
  const { postId, collectionId } = req.params
  const { _id: currentUserId } = req.user
  const { language = '' } = req.headers

  const t = translate(language)
  const post = await Post.findById(postId)
  if (!post) {
    throw new NotFound('Post no exists')
  }

  const collection = await Collection.findById(collectionId)
  if (!collection) {
    throw new NotFound('Collection no exists')
  }

  const isPostExistsInCollection = collection.posts.some((el) => el.toString() === postId)
  if (!isPostExistsInCollection) {
    throw new NotFound(`This post already not saved in ${collection.title}`)
  }

  await Collection.findByIdAndUpdate(collectionId, {
    $pull: {
      posts: postId
    }
  })

  await Post.findByIdAndUpdate(postId, {
    $inc: {
      savesCount: -1
    }
  })

  res.status(201).json({
    code: 201,
    status: 'success',
    message: t('unsaved')
  })
}

module.exports = deletePostFromCollection
