const {model, Schema} = require("mongoose");

const collectionSchema = Schema({
    // author: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'user',
    //     required: true
    // },
    authors: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'user',
        }],
        required: true
    },
    isPrivate: {
        type: Schema.Types.Boolean,
        default: false,
    },
    title: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        required: true
    },
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'post'
    }]
}, {
    timestamps: true
})

const Collection = model('collection', collectionSchema)

module.exports = Collection
