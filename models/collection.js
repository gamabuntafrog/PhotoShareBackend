const { model, Schema } = require('mongoose')

const roles = ['AUTHOR', 'ADMIN']

const isPrivate = true
const viewers = ['id', 'id1']
// const requests = ['id', 'id1']

const collectionSchema = Schema(
  {
    authors: {
      type: [
        {
          user: {
            type: Schema.Types.ObjectId,
            ref: 'user'
          },
          roles: [
            {
              type: String,
              default: 'ADMIN'
            }
          ]
        }
      ],
      required: true
    },
    isPrivate: {
      type: Schema.Types.Boolean,
      default: false
    },
    viewers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'user'
      }
    ],
    requests: [
      {
        type: Schema.Types.ObjectId,
        ref: 'user'
      }
    ],
    title: {
      type: String,
      required: true
    },
    tags: {
      type: [String],
      required: true
    },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'post'
      }
    ]
  },
  {
    timestamps: true
  }
)

const Collection = model('collection', collectionSchema)

module.exports = Collection
