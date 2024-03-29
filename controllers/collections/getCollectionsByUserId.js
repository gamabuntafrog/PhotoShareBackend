const { User, Collection, Post } = require('../../models')
const translate = require('../../utils/language/translate')

const getCollectionsByUserId = async (req, res) => {
  const { id } = req.params
  const { currentUserId } = req
  const { language = '' } = req.headers

  const t = translate(language)

  const { collections } = await User.findById(id).populate({
    path: 'collections',
    populate: {
      path: 'posts',
      perDocumentLimit: 3,
      options: {
        sort: {
          createdAt: -1
        }
      }
    }
  })

  // const {posts: testPosts} = await User.findById(id)

  console.log(collections.map((col) => col.posts.length))

  const formattedCollections = collections
    .filter((collection) => {
      if (!collection.isPrivate) return true

      const isCurrentUserAuthorOfCollection = collection.authors.some(
        ({ user: _id }) => _id.toString() === currentUserId.toString()
      )
      const isViewer = collection.viewers.some((id) => id.toString() === currentUserId.toString())

      if (isCurrentUserAuthorOfCollection || isViewer) return true

      return false
    })
    .map((collection) => {
      const { _id, title, posts, authors } = collection

      const formattedPosts = posts.map((post) => {
        const {
          _id,
          image: { url }
        } = post

        return {
          _id,
          image: url
        }
      })

      const formattedCollection = {
        _id,
        title,
        posts: formattedPosts,
        authors
      }

      return formattedCollection
    })

  res.status(200).json({
    code: 200,
    status: 'success',
    data: {
      collections: formattedCollections
    }
  })
}

module.exports = getCollectionsByUserId
