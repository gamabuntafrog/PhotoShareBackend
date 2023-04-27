const { Post, User } = require('../../models')

const getByTags = async (req, res) => {
  const { tags = [] } = req.query
  const { id } = req.params
  const { currentUserId } = req
  const parsedTags = JSON.parse(tags)

  const formattedForRegexTags = parsedTags.map((tag) => new RegExp('^' + tag.toLowerCase(), 'i'))

  const posts = await Post.find({
    tags: {
      $in: formattedForRegexTags
    },
    _id: {
      $ne: id
    }
  }).populate('author')

  const currentUser = await User.findById(currentUserId).populate('collections')

  const validatedPosts = posts.map((post) => {
    const {
      _id: postId,
      author,
      title,
      image: { url },
      body,
      tags,
      savesCount,
      likesCount,
      createdAt,
      updatedAt
    } = post
    console.log(author)
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
      savesInfo,
      createdAt,
      updatedAt
    }

    return validatedPost
  })

  res.status(200).send({
    code: 200,
    status: 'success',
    data: {
      posts: validatedPosts
    }
  })
}

module.exports = getByTags
