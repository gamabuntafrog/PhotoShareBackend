const getAll = require('./getAll')
const createPost = require('./createPost')
const findOneById = require('./findOneById')
const findByUsername = require('./findByUsername')
const findByTags = require('./findByTags')
const getByTitle = require('./getByTitle')
const getMy = require('./getMy')
const getSaved = require('./getSaved')
const like = require('./like')
const unlike = require('./unlike')
const deletePost = require('./deletePost')

module.exports = {
    getAll,
    createPost,
    findOneById,
    findByUsername,
    findByTags,
    getByTitle,
    getMy,
    getSaved,
    like,
    unlike,
    deletePost
}