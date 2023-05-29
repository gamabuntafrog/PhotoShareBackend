const PostsAggregations = require('../../helpers/postsAggregations')
const { User } = require('../../models')
const translate = require('../../utils/language/translate')

const getPostsByUserId = async (req, res) => {
  const { currentUserId } = req
  const { id } = req.params
  const { arrayOfId = '[]' } = req.query

  const parsedArrayOfId = JSON.parse(arrayOfId)

  // const postsAggregations = new PostsAggregations

  const { posts } = await User.findById(id).populate({
    path: 'posts',
    options: {
      sort: { createdAt: -1 }
    },
    populate: {
      path: 'author'
    }
  })

  const filteredPosts = posts.filter(
    ({ _id }) => !parsedArrayOfId.find((id) => id === _id.toString())
  )
  const slicedPosts = filteredPosts.slice(0, 15)

  const currentUser = await User.findById(currentUserId).populate('collections')

  const validatedPosts = slicedPosts.map((post) => {
    const {
      _id: postId,
      author,
      title,
      image: { url },
      body,
      tags,
      savesCount,
      likesCount
    } = post
    const {
      _id: authorId,
      avatar: { url: avatarUrl },
      username
    } = author

    const isLiked = post.usersLiked.some((id) => id.toString() === currentUserId.toString())
    const isSomewhereSaved = currentUser.collections.some(({ posts }) =>
      posts.find((id) => id.toString() === postId.toString())
    )

    const savesInfo = currentUser.collections.map(({ title, posts, _id }) => {
      const isPostInCollection = posts.find((id) => id.toString() === postId.toString())

      if (isPostInCollection) {
        return { title, collectionId: _id, isSaved: true }
      } else {
        return { title, collectionId: _id, isSaved: false }
      }
    })

    const validatedAuthor = { _id: authorId, avatar: avatarUrl, username }
    const validatedPost = {
      _id: postId,
      author: validatedAuthor,
      title,
      image: url,
      body,
      tags,
      savesCount,
      likesCount,
      isLiked,
      isSomewhereSaved,
      savesInfo
    }

    return validatedPost
  })

  res.status(200).json({
    code: 200,
    status: 'success',
    data: {
      posts: validatedPosts
    }
  })
}

module.exports = getPostsByUserId
