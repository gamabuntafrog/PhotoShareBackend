class PostAggregation {
  currentUserId

  constructor(currentUserId) {
    this.currentUserId = currentUserId
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
              username: 1,
              subscribersCount: {
                $size: '$subscribers'
              }
            }
          }
        ]
      }
    },
    {
      $unwind: '$author'
    }
  ]

  lookupAuthorOfComment = [
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

  lookupReply = {
    $lookup: {
      from: 'subcomments',
      localField: 'replies',
      foreignField: '_id',
      as: 'replies',
      pipeline: [...this.lookupAuthorOfComment]
    }
  }

  lookupComment = {
    $lookup: {
      from: 'comments',
      localField: 'comments',
      foreignField: '_id',
      as: 'comments',
      pipeline: [...this.lookupAuthorOfComment, this.lookupReply]
    }
  }

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
      comments: {
        author: 1,
        createdAt: 1,
        updatedAt: 1,
        postRef: 1,
        replies: 1,
        text: 1,
        _id: 1
      },
      image: '$image.url',
      likesCount: 1,
      savesCount: 1,
      tags: 1,
      title: 1,
      body: 1,
      savesInfo: this.savesInfo,
      isSomewhereSaved: this.isSomewhereSaved,
      isLiked: this.isLiked(this.currentUserId)
    }
  }

  
}

module.exports = PostAggregation
