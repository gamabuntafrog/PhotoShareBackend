const Collection = require("../../models/collection");
const {Conflict} = require('http-errors')
const {User} = require("../../models");
const findOutIsCurrentUserAdmin = require('./middlewares/findOutIsCurrentUserAdmin')


const addAuthorToCollection = async (req, res) => {
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

    if (isAuthorAlreadyExists) {
        throw new Conflict('User already author')
    }

    const isAuthorAlreadyHasThisRole = collection.authors
        .some(({user: userId, roles}) =>
            userId.toString() === authorId.toString() && roles.includes(role))

    if (isAuthorAlreadyHasThisRole) {
        throw new Conflict('Author already has this role')
    }

    const isUserViewer = collection.viewers.some((userId) => userId.toString() === authorId.toString())

    if (isUserViewer) {
        await Collection.findByIdAndUpdate(collectionId, {
            $pull: {
                viewers: authorId
            }
        })
        await User.findByIdAndUpdate(authorId, {
            $pull: {
                allowedToViewCollections: collectionId
            }
        })
    }

    await Collection.findByIdAndUpdate(collectionId, {
        $push: {
            authors: {
                user: authorId,
                roles: [role]
            }
        }
    })


    await User.findByIdAndUpdate(authorId, {
        $push: {
            collections: collectionId
        }
    })

    res.status(201).json({
        code: 201,
        status: 'success',
        message: 'Successfully added'
    })
}

module.exports = addAuthorToCollection
