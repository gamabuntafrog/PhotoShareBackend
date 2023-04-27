const { User } = require('../../models')
const { NotFound } = require('http-errors')
const translate = require('../../utils/language/translate')
const { Types } = require('mongoose')

const getById = async (req, res) => {
  const { currentUserId } = req
  const { id } = req.params
  const { language = '' } = req.headers

  const t = translate(language)

  const pipeline = [
    { $match: { _id: new Types.ObjectId(id) } },
    {
      $project: {
        avatar: '$avatar.url',
        username: 1,
        subscribesCount: { $size: '$subscribes' },
        subscribersCount: { $size: '$subscribers' },
        postsCount: { $size: '$posts' },
        createdAt: 1,
        canViewAllowedToViewCollections: {
          $eq: [new Types.ObjectId(id), currentUserId]
        }
      }
    }
  ]

  const [user] = await User.aggregate(pipeline).exec()

  if (!user) {
    throw new NotFound(t('notFound'))
  }

  res.status(200).json({
    code: 200,
    status: 'success',
    data: {
      user: user
    }
  })
}

module.exports = getById
