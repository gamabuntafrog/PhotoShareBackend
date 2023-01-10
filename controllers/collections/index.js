const create = require('./create')
const getCurrent = require('./getCurrent')
const getPopulatedCollection = require('./getPopulatedCollection')
const likePostInCollection = require('./likePostInCollection')
const unlikePostInCollection = require('./unlikePostInCollection')
const savePostInCollection = require('./savePostInCollection')
const unsavePostInCollection = require('./unsavePostInCollection')
const deleteCollection = require('./deleteCollection')

module.exports = {
    create,
    getCurrent,
    getPopulatedCollection,
    likePostInCollection,
    unlikePostInCollection,
    savePostInCollection,
    unsavePostInCollection,
    deleteCollection
}