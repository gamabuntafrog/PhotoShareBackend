const { Collection } = require('../../models')
const { Conflict } = require('http-errors')
const translate = require('../../utils/language/translate')

const unsendRequestToJoinFromCollection = async (req, res) => {
  const { collectionId } = req.params
  const { currentUserId } = req
  const { language = '' } = req.headers

  const t = translate(language)

  const collection = await Collection.findById(collectionId)

  const isUserViewer = collection.viewers.some(
    (userId) => userId.toString() === currentUserId.toString()
  )
  const isUserAuthor = collection.authors.some(
    ({ user: userId }) => userId.toString() === currentUserId.toString()
  )
  const isUserAlreadyInQueue = collection.requests.some(
    (userId) => userId.toString() === currentUserId.toString()
  )

  if (isUserViewer || isUserAuthor || !isUserAlreadyInQueue) {
    throw new Conflict(t('dontHavePermission'))
  }

  await Collection.findByIdAndUpdate(collectionId, {
    $pull: {
      requests: currentUserId
    }
  })

  res.status(201).json({
    code: 201,
    status: 'success',
    message: t('requestSent')
  })
}

module.exports = unsendRequestToJoinFromCollection
