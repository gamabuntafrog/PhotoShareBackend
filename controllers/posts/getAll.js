const { Types } = require('mongoose')
const { Post, User } = require('../../models')
const paginationQuery = require('../../helpers/paginationQuery')

const getAll = async (req, res) => {
  const { currentUserId, currentUser: currentUserFromReq } = req
  const { arrayOfId, limit } = paginationQuery(req.query)

  const pipeline = [
    { $match: { _id: { $nin: arrayOfId } } },
    {
      $sort: {
        createdAt: -1
      }
    },
    {
      $limit: limit
    },
    {
      $lookup: {
        from: 'users',
        localField: 'author',
        foreignField: '_id',
        as: 'author',
        pipeline: [
          {
            $project: {
              avatar: '$avatar.url',
              username: 1
            }
          }
        ]
      }
    },
    {
      $unwind: '$author'
    },
    {
      $addFields: {
        currentUserCollections: currentUserFromReq.collections
      }
    },
    {
      $lookup: {
        from: 'collections',
        localField: 'currentUserCollections',
        foreignField: '_id',
        as: 'currentUserCollections',
        pipeline: [{ $project: { title: 1, posts: 1 } }]
      }
    },
    {
      $project: {
        author: 1,
        title: 1,
        image: '$image.url',
        body: 1,
        tags: 1,
        savesCount: 1,
        likesCount: 1,
        createdAt: 1,
        updatedAt: 1,
        isLiked: { $in: [currentUserId, '$usersLiked'] },
        isSomewhereSaved: {
          $anyElementTrue: {
            $map: {
              input: '$currentUserCollections',
              as: 'collection',
              in: {
                $in: ['$$CURRENT._id', '$$collection.posts']
              }
            }
          }
        },
        savesInfo: {
          $map: {
            input: '$currentUserCollections',
            as: 'collection',
            in: {
              title: '$$collection.title',
              collectionId: '$$collection._id',
              isSaved: {
                $in: ['$$CURRENT._id', '$$collection.posts']
              }
            }
          }
        }
      }
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
