const posts = require('./posts')
const users = require('./users')
const auth = require('./auth')
const commentsToPost = require('./commentsToPost')
const notifications = require('./notifications')

module.exports = {
    posts,
    users,
    auth,
    commentsToPost,
    notifications
}