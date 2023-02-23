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
    postRef: {
        type: Schema.Types.ObjectId,
        ref: 'post',
        required: true
    },
    replies: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'subcomment'
        }]
    }
},{
    timestamps: true
})

const Comment = model('comment', commentSchema)

module.exports = Comment

