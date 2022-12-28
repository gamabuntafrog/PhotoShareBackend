const {model, Schema} = require("mongoose");

const collectionSchema = Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
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
