const { Post } = require('../../models')
const paginationQuery = require('../../helpers/paginationQuery')
const PostsAggregation = require('../../helpers/postsAggregation')

const getAll = async (req, res) => {
  const { currentUserId, currentUser } = req
  const { arrayOfId } = paginationQuery(req.query)

  const postAggregations = new PostsAggregation(currentUserId)

  const pipeline = [
    { $match: { _id: { $nin: arrayOfId } } },
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
