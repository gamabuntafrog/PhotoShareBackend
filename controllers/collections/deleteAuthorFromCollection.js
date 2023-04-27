const Collection = require('../../models/collection')
const { Conflict, NotFound } = require('http-errors')
const { User, Notification } = require('../../models')
const findOutIsCurrentUserAdmin = require('./middlewares/findOutIsCurrentUserAdmin')
const translate = require('../../utils/language/translate')
const notificationTypes = require('../../utils/notificationTypes')

const deleteAuthorFromCollection = async (req, res) => {
  const { collectionId, authorId } = req.params
  const { currentUserId } = req
  const { language = '' } = req.headers

  const t = translate(language)
  const collection = await Collection.findById(collectionId)

  if (!collection) {
    throw new NotFound(t('collectionNotFound'))
  }

  if (!findOutIsCurrentUserAdmin(collection.authors, currentUserId)) {
    throw new Conflict(t('dontHavePermission'))
  }

  const isAuthorAlreadyExists = collection.authors.some(
    ({ user: userId }) => userId.toString() === authorId.toString()
  )

  if (!isAuthorAlreadyExists) {
    throw new Conflict(t('userAlreadyNotAuthor'))
  }

  await Collection.findByIdAndUpdate(collectionId, {
    $pull: {
      authors: {
        user: authorId
      }
    }
  })

  await User.findByIdAndUpdate(authorId, {
    $pull: {
      collections: collectionId
    }
  })

  await Notification.create({
    userRef: currentUserId,
    receiver: authorId,
    type: notificationTypes.deleteUserFromCollection,
    collectionRef: collectionId
  })

  res.status(201).json({
    code: 201,
    status: 'success',
    message: t('successfullyDeleted')
  })
}

module.exports = deleteAuthorFromCollection
