const getAll = require('./getAll')
const addToSubscribes = require('./addToSubscribes')
const deleteFromSubscribes = require('./deleteFromSubscribes')
const getSubscribes = require('./getSubscribes')
const getCurrent = require('./getCurrent')
const getById = require('./getById')
const updateCurrent = require('./updateCurrent')
const getUsersForAddInCollection = require('./getUsersForAddInCollection')

module.exports = {
    getAll,
    addToSubscribes,
    deleteFromSubscribes,
    getSubscribes,
    getCurrent,
    getById,
    updateCurrent,
    getUsersForAddInCollection
}