const Collection = require("../../models/collection");
const {Conflict} = require('http-errors')
const {User} = require("../../models");

const addAuthorToCollection = async (req, res) => {
    const {collectionId, authorId} = req.params
    const {currentUserId, currentUser} = req

    const collection = await Collection.findById(collectionId)

    if (!collection) {
        throw new NotFound('Collection does not exists')
    }

    const isCurrentUserAuthorOfCollection = collection.authors.some((id) => id.toString() === currentUserId.toString())

    if (!isCurrentUserAuthorOfCollection) {
        throw new Conflict('You dont have permission')
    }

    const isAuthorAlreadyExists = collection.authors.some((id) => id.toString() === authorId)

    if (isAuthorAlreadyExists) {
        throw new Conflict('User already author')
    }

    await Collection.findByIdAndUpdate(collectionId, {
        $push: {
            authors: authorId
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
        messsage: 'Successfully added'
    })
}

module.exports = addAuthorToCollection
