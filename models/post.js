const {Schema, model} = require('mongoose')


const postSchema = Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    title: {
        type: String,
        required: true
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
        required: true
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
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'user'
        }],
    },
    likesCount: {
        type: Number,
        default: 0
    },
    comments: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'comment'
        }]
    }
}, {
    timestamps: true
})

const Post = model('post', postSchema)

module.exports = Post

