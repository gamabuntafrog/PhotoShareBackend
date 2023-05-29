const { Collection } = require('../../models')
const { Types } = require('mongoose')
const PostsAggregation = require('../../helpers/postsAggregation')
const paginationQuery = require('../../helpers/paginationQuery')

const getPostsByCollectionId = async (req, res) => {
  const { id: collectionId } = req.params
  const { currentUserId, currentUser: currentUserTest } = req

  const postsAggregation = new PostsAggregation(currentUserId)

  const { arrayOfId } = paginationQuery(req.query)

  const pipeline = [
    {
      $match: {
        _id: new Types.ObjectId(collectionId)
      }
    },
    {
      $lookup: {
        from: 'posts',
        localField: 'posts',
        foreignField: '_id',
        as: 'post'
      }
    },
    {
      $unwind: '$post'
    },
    {
      $replaceRoot: {
        newRoot: '$post'
      }
    },
    {
      $match: {
        _id: {
          $nin: arrayOfId
        }
      }
    },
    ...postsAggregation.standardPipeline(currentUserTest.collections, req.query)
  ]

  const posts = await Collection.aggregate(pipeline).exec()

  res.status(200).json({
    status: 'success',
    code: 200,
    data: {
      posts
    }
  })
}

module.exports = getPostsByCollectionId
