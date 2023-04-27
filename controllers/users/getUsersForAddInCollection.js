const { User, Collection } = require('../../models')

const getUsersForAddInCollection = async (req, res) => {
  const { username, collectionId } = req.query

  const collection = await Collection.findById(collectionId)

  const authors = collection.authors.map((author) => author.user)

  const users = await User.find({
    // find by username
    username: {
      $regex: username,
      $options: 'i'
    },
    // find users which not authors of this collection
    _id: {
      $nin: [...authors, ...collection.viewers]
    }
  })

  const validatedAuthors = users.map(({ _id, avatar: { url: avatarUrl }, username }) => {
    return { _id, avatar: avatarUrl, username }
  })

  res.status(200).send({
    code: 200,
    status: 'success',
    data: {
      users: validatedAuthors
    }
  })
}

module.exports = getUsersForAddInCollection
