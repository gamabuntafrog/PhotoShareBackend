const formatTagsFromQuery = require('../../helpers/formatTagsFromQuery')
const PostsAggregation = require('../../helpers/postsAggregation')
const { Post, User } = require('../../models')

const getByTags = async (req, res) => {
  const { id } = req.params
  const { currentUserId, currentUser: currentUserTest } = req
  const tags = formatTagsFromQuery(req.query)

  const postsAggregation = new PostsAggregation(currentUserId)

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
    ...postsAggregation.standardPipeline(currentUserTest.collections, req.query)
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
