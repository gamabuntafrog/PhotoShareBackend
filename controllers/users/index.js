const getAll = require('./getAll')
const addToSubscribes = require('./addToSubscribes')
const deleteFromSubscribes = require('./deleteFromSubscribes')
const getSubscribes = require('./getSubscribes')
const getCurrent = require('./getCurrent')
const getById = require('./getById')
const updateCurrent = require('./updateCurrent')
const getUsersForAddInCollection = require('./getUsersForAddInCollection')
const getCollectionsByUserId = require('./getCollectionsByUserId')
const getAllowedToViewCollections = require('./getAllowedToViewCollections')
const getPostsByUserId = require('./getPostsByUserId')
const getUsersForSearchBar = require('./getUsersForSearchBar')
const getUsersByUsername = require('./getUsersByUsername')

module.exports = {
    getAll,
    addToSubscribes,
    deleteFromSubscribes,
    getSubscribes,
    getCurrent,
    getById,
    updateCurrent,
    getUsersForAddInCollection,
    getCollectionsByUserId,
    getAllowedToViewCollections,
    getPostsByUserId,
    getUsersForSearchBar,
    getUsersByUsername
}