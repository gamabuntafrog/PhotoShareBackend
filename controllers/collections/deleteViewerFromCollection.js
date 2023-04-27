const Collection = require('../../models/collection')
const { Conflict, NotFound } = require('http-errors')
const { User } = require('../../models')
const findOutIsCurrentUserAdmin = require('./middlewares/findOutIsCurrentUserAdmin')
const translate = require('../../utils/language/translate')

const deleteViewerFromCollection = async (req, res) => {
  const { collectionId, viewerId } = req.params
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

  const isViewerAlreadyExists = collection.viewers.some(
    (userId) => userId.toString() === viewerId.toString()
  )

  if (!isViewerAlreadyExists) {
    throw new Conflict(t('userAlreadyViewer'))
  }

  await Collection.findByIdAndUpdate(collectionId, {
    $pull: {
      viewers: viewerId
    }
  })

  await User.findByIdAndUpdate(viewerId, {
    $pull: {
      allowedToViewCollections: collectionId
    }
  })

  res.status(201).json({
    code: 201,
    status: 'success',
    message: t('successfullyDeleted')
  })
}

module.exports = deleteViewerFromCollection
