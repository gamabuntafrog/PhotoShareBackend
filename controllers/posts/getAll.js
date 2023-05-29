const { Types } = require('mongoose')
const { Post, User } = require('../../models')
const paginationQuery = require('../../helpers/paginationQuery')
const PostsAggregations = require('../../helpers/postsAggregations')

const getAll = async (req, res) => {
  const { currentUserId, currentUser } = req
  const { arrayOfId, limit } = paginationQuery(req.query)

  const { sort, lookupAuthor, addCurrentUserCollections, standardProject } = new PostsAggregations(
    currentUserId
  )

  const pipeline = [
    { $match: { _id: { $nin: arrayOfId } } },
    {
      $sort: sort
    },
    {
      $limit: limit
    },
    ...lookupAuthor,
    ...addCurrentUserCollections(currentUser.collections),
    {
      $project: standardProject
    }
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
