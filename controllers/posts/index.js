const getAll = require('./getAll')
const createPost = require('./createPost')
const findOneById = require('./findOneById')
const getByTitle = require('./getByTitle')
const like = require('./like')
const unlike = require('./unlike')
const deletePost = require('./deletePost')
const getPostsByCollectionId = require('./getPostsByCollectionId')
const getPostsByUserId = require('./getPostsByUserId')

module.exports = {
    getAll,
    createPost,
    findOneById,
    getByTitle,
    like,
    unlike,
    deletePost,
    getPostsByCollectionId,
    getPostsByUserId
}