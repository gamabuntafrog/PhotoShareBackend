const {Schema, model} = require('mongoose')


const notificationSchema = Schema(
    {
        type: {
            type: String,
            required: true
        },
        receiver: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        postId: {
            type: Schema.Types.ObjectId,
            ref: 'post',
            required: false
        },
        checked: {
            type: Boolean,
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