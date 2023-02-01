const Collection = require("../../models/collection");
const {Conflict} = require('http-errors')
const {User} = require("../../models");
const findOutIsCurrentUserAdmin = require('./middlewares/findOutIsCurrentUserAdmin')

const changeUserRole = async (req, res) => {
    const {collectionId, authorId} = req.params
    const {role = 'AUTHOR'} = req.query
    const {currentUserId} = req

    const collection = await Collection.findById(collectionId)

    if (!collection) {
        throw new NotFound('Collection does not exists')
    }

    if (!findOutIsCurrentUserAdmin(collection.authors, currentUserId)) {
        throw new Conflict('You dont have permission')
    }

    const isAuthorAlreadyExists = collection.authors.some(({user: userId}) => userId.toString() === authorId.toString())

    if (!isAuthorAlreadyExists) {
        throw new Conflict('Author already not author')
    }

    const isAuthorAlreadyHasThisRole = collection.authors
        .some(({user: userId, roles}) =>
            userId.toString() === authorId.toString() && roles.includes(role))

    if (isAuthorAlreadyHasThisRole) {
        throw new Conflict('Author already has this role')
    }

    const index = collection.authors.findIndex(({user: userId}) => userId.toString() === authorId.toString())

    await Collection.findByIdAndUpdate(collectionId, {
        $set: {
            [`authors.${index}.roles`]: [role]
        }
    })

    res.status(201).json({
        code: 201,
        status: 'success',
        message: 'Successfully changed'
    })
}

module.exports = changeUserRole