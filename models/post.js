const { Schema, model } = require('mongoose')

const postSchema = Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },
    title: {
      type: String,
      default: ''
    },
    image: {
      url: {
        type: String,
        required: true
      },
      id: {
        type: String,
        required: true
      }
    },
    body: {
      type: String,
      default: ''
    },
    tags: {
      type: [String],
      required: true
    },
    savesCount: {
      type: Number,
      default: 0
    },
    usersLiked: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'user'
        }
      ]
    },
    likesCount: {
      type: Number,
      default: 0
    },
    comments: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'comment'
        }
      ]
    }
  },
  {
    timestamps: true
  }
)

// postSchema.pre('find', function (next, docs) {
//     this.where({title: 'test'})
//     console.log(doc)
//     // const isLiked = post.usersLiked.some((id) => id.toString() === currentUserId.toString())
//     next()
// })

const Post = model('post', postSchema)

module.exports = Post
