const getAll = require('./getAll')
const addOne = require('./addOne')
const findOneById = require('./findOneById')
const findByUsername = require('./findByUsername')
const findByTags = require('./findByTags')
const getByTitle = require('./getByTitle')
const getMy = require('./getMy')
const getSaved = require('./getSaved')
const addToSaved = require('./addToSaved')
const deleteFromSaved = require('./deleteFromSaved')
const like = require('./like')
const unlike = require('./unlike')


module.exports = {
    getAll,
    addOne,
    findOneById,
    findByUsername,
    findByTags,
    getByTitle,
    getMy,
    getSaved,
    addToSaved,
    deleteFromSaved,
    like,
    unlike
}