const { Post, Collection, User } = require('../../models')
const { log } = require('debug')
const { NotFound } = require('http-errors')
const translate = require('../../utils/language/translate')
const { Types } = require('mongoose')
const PostAggregation = require('../../helpers/postAggregation')

const findOneById = async (req, res) => {
  const {
    currentUserId,
    currentUser: { collections }
  } = req
  const { id: postId } = req.params
  const { language = '' } = req.headers

  const t = translate(language)

  const postAggregation = new PostAggregation(currentUserId)

  const pipeline = [
    {
      $match: { _id: new Types.ObjectId(postId) }
    },
    ...postAggregation.lookupAuthor,
    postAggregation.lookupComment,
    ...postAggregation.addCurrentUserCollections(collections),
    {
      $project: postAggregation.standardProject
    }
  ]
     
  const [post] = await Post.aggregate(pipeline).exec()

  if (!post) {
    throw new NotFound(t('postNotFound'))
  }

  res.status(200).json({
    code: 200,
    status: 'success',
    data: {
      post,
    }
  })
}

module.exports = findOneById
