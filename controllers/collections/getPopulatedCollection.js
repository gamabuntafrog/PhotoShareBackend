const { Collection, User } = require('../../models')
const { NotFound, Conflict } = require('http-errors')
const translate = require('../../utils/language/translate')

const getPopulatedCollection = async (req, res) => {
  const { id: collectionId } = req.params
  const { currentUserId } = req
  const { language = '' } = req.headers

  const t = translate(language)
  const collection = await Collection.findById(collectionId)
    .populate('authors.user')
    .populate('viewers')
    .populate('requests')
    .populate({
      path: 'posts',
      options: {
        sort: { createdAt: -1 }
      },
      populate: 'author'
    })

  if (!collection) {
    throw new NotFound(t('collectionNotFound'))
  }

  const isCurrentUserAuthorOfCollection = collection.authors.some(
    ({ user }) => user._id.toString() === currentUserId.toString()
  )

  const isCurrentUserAdminOfCollection = collection.authors.some(
    ({ user, roles }) => user._id.toString() === currentUserId.toString() && roles.includes('ADMIN')
  )

  const isViewer = collection.viewers.some(({ _id }) => _id.toString() === currentUserId.toString())
  const isUserAlreadyInQueue = collection.requests.some(
    ({ _id: userId }) => userId.toString() === currentUserId.toString()
  )

  if (collection.isPrivate) {
    if (!isCurrentUserAuthorOfCollection && !isViewer) {
      throw new NotFound(t('collectionNotFound'))
    }
  }

  const validatedAuthors = collection.authors.map(({ user, roles }) => {
    const {
      _id: authorId,
      avatar: { url: avatarUrl },
      username,
      subscribers
    } = user

    const isAdmin = roles.includes('ADMIN')
    const isAuthor = roles.includes('AUTHOR')

    return {
      _id: authorId,
      avatar: avatarUrl,
      username,
      subscribersCount: subscribers.length,
      isAuthor,
      isAdmin
    }
  })

  const validatedRequests = collection.requests.map((user) => {
    const {
      _id: authorId,
      avatar: { url: avatarUrl },
      username
    } = user

    return { _id: authorId, avatar: avatarUrl, username }
  })

  const validatedViewers = collection.viewers.map((viewer) => {
    const {
      _id: authorId,
      avatar: { url: avatarUrl },
      username
    } = viewer

    return { _id: authorId, avatar: avatarUrl, username }
  })

  res.status(200).json({
    status: 'success',
    code: 200,
    data: {
      currentUserStatus: {
        isAuthor: isCurrentUserAuthorOfCollection,
        isAdmin: isCurrentUserAdminOfCollection,
        isViewer,
        isInQueue: isUserAlreadyInQueue
      },
      collection: {
        ...collection.toObject(),
        authors: validatedAuthors,
        viewers: validatedViewers,
        requests: validatedRequests
      }
    }
  })
}

module.exports = getPopulatedCollection
