const posts = require('./posts')
const users = require('./users')
const auth = require('./auth')
const commentsToPost = require('./commentsToPost')
const notifications = require('./notifications')
const collections = require('./collections')

module.exports = {
    posts,
    users,
    auth,
    commentsToPost,
    notifications,
    collections
}