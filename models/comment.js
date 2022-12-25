const {Schema, model} = require('mongoose')


const commentSchema = Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    text: {
        type: String,
        required: true
    },
    usersLiked: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'user'
        }],
    },
    likesCount: {
        type: Number,
        default: 0
    },
    replies: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'subComment'
        }]
    }
},{
    timestamps: true
})

const Comment = model('comment', commentSchema)

module.exports = Comment

