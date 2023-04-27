const { Schema, model } = require('mongoose')

const subCommentSchema = Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },
    text: {
      type: String,
      required: true
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },
    postRef: {
      type: Schema.Types.ObjectId,
      ref: 'post',
      required: true
    },
    commentRef: {
      type: Schema.Types.ObjectId,
      ref: 'comment',
      required: true
    }
  },
  {
    timestamps: true
  }
)

const SubComment = model('subcomment', subCommentSchema)

module.exports = SubComment
