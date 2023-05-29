const { Post, Collection, User } = require('../../models')
const cloudinary = require('../../utils/cloudinary')
const translate = require('../../utils/language/translate')
const createNewObjectId = require('../../helpers/createNewObjectId')

const createPost = async (req, res) => {
  const { currentUserId } = req
  const { image: imageFile, collectionId } = req.body
  const { language = '' } = req.headers

  const t = translate(language)

  const result = await cloudinary.uploader.upload(imageFile, {
    folder: 'photos',
    width: 1280
  })

  const image = {
    url: result.secure_url,
    id: result.public_id
  }

  const postId = createNewObjectId()

  await Promise.all([
    Post.create({
      _id: postId,
      ...req.body,
      author: currentUserId,
      image
    }),
    Collection.findByIdAndUpdate(collectionId, {
      $push: {
        posts: postId
      }
    }),
    User.findByIdAndUpdate(currentUserId, {
      $push: {
        posts: postId,
        savedPosts: { post: postId, collection: collectionId }
      }
    })
  ])

  res.status(201).json({
    code: 201,
    status: 'success',
    message: t('postCreated'),
  })
}

module.exports = createPost
