const paginationQuery = require('./paginationQuery')

class PostsAggregation {
  constructor(currentUserId) {
    this.currentUserId = currentUserId
  }

  sort = {
    createdAt: -1
  }

  lookupAuthor = [
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
    }
  ]

  addCurrentUserCollections = (collections) => [
    {
      $addFields: {
        currentUserCollections: collections
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
    }
  ]

  isSomewhereSaved = {
    $anyElementTrue: {
      $map: {
        input: '$currentUserCollections',
        as: 'collection',
        in: {
          $in: ['$$CURRENT._id', '$$collection.posts']
        }
      }
    }
  }

  savesInfo = {
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

  isLiked = (currentUserId) => ({ $in: [currentUserId, '$usersLiked'] })

  get standardProject() {
    return {
      author: 1,
      title: 1,
      image: '$image.url',
      body: 1,
      tags: 1,
      savesCount: 1,
      likesCount: 1,
      createdAt: 1,
      updatedAt: 1,
      isLiked: this.isLiked(this.currentUserId),
      isSomewhereSaved: this.isSomewhereSaved,
      savesInfo: this.savesInfo
    }
  }

  standardPipeline(collections, query) {
    
    return [
      {
        $sort: this.sort
      },
      {
        $limit: paginationQuery(query).limit
      },
      ...this.lookupAuthor,
      ...this.addCurrentUserCollections(collections),
      {
        $project: this.standardProject
      }
    ]
  }
}

module.exports = PostsAggregation
