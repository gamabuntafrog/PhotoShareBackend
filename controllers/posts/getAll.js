const { Post, User } = require('../../models')
const paginationQuery = require('../../helpers/paginationQuery')
const PostsAggregation = require('../../helpers/postsAggregation')
const { Types } = require('mongoose')

const getAll = async (req, res) => {
  const { currentUserId, currentUser } = req
  const { arrayOfId } = paginationQuery(req.query)
  const postAggregations = new PostsAggregation(currentUserId)

  const match = {
    _id: { $nin: arrayOfId }
  }

  if (req.query.type === 'subscribes') {
    match.$and = [
      { author: { $ne: new Types.ObjectId(currentUserId) } },
      { author: { $in: currentUser.subscribes.map((el) => new Types.ObjectId(el)) } }
    ]
  }

  const pipeline = [
    { $match: match },
    ...postAggregations.standardPipeline(currentUser.collections, req.query)
  ]

  const posts = await Post.aggregate(pipeline).exec()

  res.status(200).json({
    code: 200,
    status: 'success',
    data: {
      posts: posts
    }
  })
}

module.exports = getAll
