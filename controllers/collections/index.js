const createCollection = require('./createCollection')
const getCurrent = require('./getCurrent')
const getPopulatedCollection = require('./getPopulatedCollection')
const savePostInCollection = require('./savePostInCollection')
const deletePostFromCollection = require('./deletePostFromCollection')
const deleteCollection = require('./deleteCollection')
const addAuthorToCollection = require('./addAuthorToCollection')

module.exports = {
    createCollection,
    getCurrent,
    getPopulatedCollection,
    savePostInCollection,
    deletePostFromCollection,
    deleteCollection,
    addAuthorToCollection
}