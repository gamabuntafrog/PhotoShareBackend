const { Collection, User } = require('../../models')
const translate = require('../../utils/language/translate')

const createCollection = async (req, res) => {
  const { currentUserId } = req
  const { language = '' } = req.headers

  const t = translate(language)
  const collection = await Collection.create({
    authors: [{ user: currentUserId, roles: ['ADMIN'] }],
    ...req.body
  })

  await User.findByIdAndUpdate(currentUserId, {
    $push: {
      collections: collection._id
    }
  })

  res.status(201).json({
    status: 'success',
    code: 201,
    message: t('collectionCreated'),
    data: {
      collection
    }
  })
}

module.exports = createCollection
