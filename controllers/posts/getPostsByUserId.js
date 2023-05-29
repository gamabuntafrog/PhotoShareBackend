const { Types } = require('mongoose')
const PostsAggregations = require('../../helpers/postsAggregations')
const { Post } = require('../../models')
const paginationQuery = require('../../helpers/paginationQuery')

const getPostsByUserId = async (req, res) => {
  const { currentUserId, currentUser } = req
  const { id } = req.params
  const { arrayOfId } = paginationQuery(req.query)

  const postsAggregations = new PostsAggregations(currentUserId)

  const pipeline = [
    {
      $match: { author: new Types.ObjectId(id), _id: { $nin: arrayOfId } }
    },
    ...postsAggregations.standardPipeline(currentUser.collections, req.query)
  ]

  const posts = await Post.aggregate(pipeline)

  res.status(200).json({
    code: 200,
    status: 'success',
    data: {
      posts,
    }
  })
}

module.exports = getPostsByUserId
