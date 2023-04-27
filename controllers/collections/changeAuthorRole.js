const Collection = require('../../models/collection')
const { Conflict, NotFound } = require('http-errors')
const { User, Notification } = require('../../models')
const findOutIsCurrentUserAdmin = require('./middlewares/findOutIsCurrentUserAdmin')
const translate = require('../../utils/language/translate')
const notificationTypes = require('../../utils/notificationTypes')

const changeUserRole = async (req, res) => {
  const { collectionId, authorId } = req.params
  const { role = 'AUTHOR' } = req.query
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

  const isAuthorAlreadyHasThisRole = collection.authors.some(
    ({ user: userId, roles }) => userId.toString() === authorId.toString() && roles.includes(role)
  )

  if (isAuthorAlreadyHasThisRole) {
    throw new Conflict(t('userAlreadyHasRole'))
  }

  const index = collection.authors.findIndex(
    ({ user: userId }) => userId.toString() === authorId.toString()
  )

  await Collection.findByIdAndUpdate(collectionId, {
    $set: {
      [`authors.${index}.roles`]: [role]
    }
  })

  await Notification.create({
    userRef: currentUserId,
    receiver: authorId,
    type: notificationTypes.changeUserRoleInCollection,
    collectionRef: collectionId
  })

  res.status(201).json({
    code: 201,
    status: 'success',
    message: t('successfullyChanged')
  })
}

module.exports = changeUserRole
