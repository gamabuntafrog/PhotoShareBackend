const {Schema, model} = require('mongoose')


// type = subscribe/unsub, like/unlike, sendRequestToJoinToCollection/unsend

const notificationSchema = Schema(
    {
        type: {
            type: Schema.Types.String,
            required: true
        },
        receiver: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        userRef: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        postRef: {
            type: Schema.Types.ObjectId,
            ref: 'post',
            required: false,
            default: null
        },
        collectionRef: {
            type: Schema.Types.ObjectId,
            ref: 'collection',
            required: false,
            default: null
        },
        checked: {
            type: Schema.Types.Boolean,
            required: false,
            default: false
        }
    },
    {
        timestamps: true
    }
)

const Notification = model('notification', notificationSchema)

module.exports = Notification