const Collection = require("../../models/collection");
const {Conflict, NotFound} = require('http-errors')
const {User} = require("../../models");
const findOutIsCurrentUserAdmin = require('./middlewares/findOutIsCurrentUserAdmin')
const translate = require("../../utils/language/translate");


const addAuthorToCollection = async (req, res) => {
    const {collectionId, authorId} = req.params
    const {role = 'AUTHOR'} = req.query
    const {currentUserId} = req
    const {language = ''} = req.headers

    const t = translate(language)

    const collection = await Collection.findById(collectionId)

    if (!collection) {
        throw new NotFound(t('collectionNotFound'))
    }

    if (!findOutIsCurrentUserAdmin(collection.authors, currentUserId)) {
        throw new Conflict(t('dontHavePermission'))
    }

    const isAuthorAlreadyExists = collection.authors.some(({user: userId}) => userId.toString() === authorId.toString())

    if (isAuthorAlreadyExists) {
        throw new Conflict(t('userAlreadyAuthor'))
    }

    const isAuthorAlreadyHasThisRole = collection.authors
        .some(({user: userId, roles}) =>
            userId.toString() === authorId.toString() && roles.includes(role))

    if (isAuthorAlreadyHasThisRole) {
        throw new Conflict(t('userAlreadyHasRole'))
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

    const isUserAlreadyInQueue = collection.requests.some((userId) => userId.toString() === authorId.toString())
    if (isUserAlreadyInQueue) {
        await Collection.findByIdAndUpdate(collectionId, {
            $pull: {
                requests: authorId
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
        message: t('roleAdded')
    })
}

module.exports = addAuthorToCollection
