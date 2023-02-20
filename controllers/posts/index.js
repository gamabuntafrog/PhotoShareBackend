const getAll = require('./getAll')
const createPost = require('./createPost')
const findOneById = require('./findOneById')
const findByUsername = require('./findByUsername')
const findByTags = require('./findByTags')
const getByTitle = require('./getByTitle')
const like = require('./like')
const unlike = require('./unlike')
const deletePost = require('./deletePost')
const getPostsByCollectionId = require('./getPostsByCollectionId')

module.exports = {
    getAll,
    createPost,
    findOneById,
    findByUsername,
    findByTags,
    getByTitle,
    like,
    unlike,
    deletePost,
    getPostsByCollectionId
}