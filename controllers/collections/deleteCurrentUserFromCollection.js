const Collection = require('../../models/collection')
const { Conflict, NotFound } = require('http-errors')
const { User } = require('../../models')
const translate = require('../../utils/language/translate')

const deleteCurrentUserFromCollection = async (req, res) => {
  const { currentUserId } = req
  const { collectionId } = req.params
  const { language = '' } = req.headers

  const t = translate(language)

  const collection = await Collection.findById(collectionId)

  if (!collection) {
    throw new NotFound(t('notFound'))
  }

  const isCurrentUserAuthorOfCollection = collection.authors.some(
    ({ user: userId }) => userId.toString() === currentUserId.toString()
  )

  const isCurrentUserViewerOfCollection = collection.viewers.some(
    (userId) => userId.toString() === currentUserId.toString()
  )

  if (!isCurrentUserAuthorOfCollection && !isCurrentUserViewerOfCollection) {
    throw new Conflict(t('dontHavePermission'))
  }

  if (isCurrentUserAuthorOfCollection) {
    await Collection.findByIdAndUpdate(collectionId, {
      $pull: {
        authors: {
          user: currentUserId
        }
      }
    })

    await User.findByIdAndUpdate(currentUserId, {
      $pull: {
        collections: collectionId
      }
    })
  } else {
    await Collection.findByIdAndUpdate(collectionId, {
      $pull: {
        viewers: currentUserId
      }
    })

    await User.findByIdAndUpdate(currentUserId, {
      $pull: {
        allowedToViewCollections: collectionId
      }
    })
  }

  res.status(202).json({
    code: 202,
    status: 'success',
    message: t('successfullyLeaved')
  })
}

module.exports = deleteCurrentUserFromCollection
