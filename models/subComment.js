const {Schema, model} = require('mongoose')


const subCommentSchema = Schema({
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
    replyTo: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
},{
    timestamps: true
})

const SubComment = model('subComment', subCommentSchema)

module.exports = SubComment