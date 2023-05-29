const formatTagsFromQuery = require('../../helpers/formatTagsFromQuery')
const PostsAggregations = require('../../helpers/postsAggregations')
const { Post, User } = require('../../models')

const getByTags = async (req, res) => {
  const { id } = req.params
  const { currentUserId, currentUser: currentUserTest } = req
  const tags = formatTagsFromQuery(req.query)

  const postsAggregations = new PostsAggregations(currentUserId)

  const pipeline = [
    {
      $match: {
        tags: {
          $in: tags
        },
        _id: {
          $ne: id
        }
      }
    },
    ...postsAggregations.standardPipeline(currentUserTest.collections, req.query)
  ]

  const posts = await Post.aggregate(pipeline).exec();

  res.status(200).send({
    code: 200,
    status: 'success',
    data: {
      posts,
    }
  })
}

module.exports = getByTags
