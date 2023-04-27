const { Schema, model } = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = Schema(
  {
    email: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    avatar: {
      url: {
        type: String,
        default: null
      },
      id: {
        type: String,
        default: null
      }
    },
    password: {
      type: String,
      required: true
    },
    age: {
      type: Number,
      default: 0
    },
    collections: {
      type: [{ type: Schema.Types.ObjectId, ref: 'collection' }]
    },
    allowedToViewCollections: {
      type: [{ type: Schema.Types.ObjectId, ref: 'collection' }]
    },
    posts: {
      type: [{ type: Schema.Types.ObjectId, ref: 'post' }]
    },
    likedPosts: {
      type: [{ type: Schema.Types.ObjectId, ref: 'post' }]
    },
    subscribes: {
      type: [{ type: Schema.Types.ObjectId, ref: 'user' }]
    },
    subscribers: {
      type: [{ type: Schema.Types.ObjectId, ref: 'user' }]
    },
    token: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
)

userSchema.methods.setPassword = function (password) {
  this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password)
}

const User = model('user', userSchema)

module.exports = User
