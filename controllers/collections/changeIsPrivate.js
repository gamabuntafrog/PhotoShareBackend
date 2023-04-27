const findOutIsCurrentUserAdmin = require('./middlewares/findOutIsCurrentUserAdmin')
const { Conflict, NotFound } = require('http-errors')
const Collection = require('../../models/collection')
const translate = require('../../utils/language/translate')

const changeIsPrivate = async (req, res) => {
  const { currentUserId } = req
  const { id: collectionId } = req.params
  const { language = '' } = req.headers

  const t = translate(language)
  const collection = await Collection.findById(collectionId)

  if (!collection) {
    throw new NotFound(t('collectionNotFound'))
  }

  if (!findOutIsCurrentUserAdmin(collection.authors, currentUserId)) {
    throw new Conflict(t('dontHavePermission'))
  }

  await Collection.findByIdAndUpdate(collectionId, {
    isPrivate: !collection.isPrivate
  })

  res.status(202).json({
    status: 'success',
    code: 202,
    message: t('successfullyChanged')
  })
}

module.exports = changeIsPrivate
