const {Post, User} = require('../../models')

const getAll = async (req, res) => {
    const {currentUserId} = req
    const {page = 1, arrayOfId = []} = req.query
    const parsedArrayOfId = JSON.parse(arrayOfId)

    const limit = 15
    const skip = limit * (page - 1)

    const posts = await Post.find({
        _id: {
            $nin: parsedArrayOfId
        }
    }).sort({createdAt: -1}).populate({
        path: 'author',
        populate: {
            path: 'collections'
        },
    }).limit(limit).skip(skip)

    // console.log(posts[0]?.createdAt)

    const currentUser = await User.findById(currentUserId).populate('collections')


    // .filter(post => post.author !== null)
    const validatedPosts = posts.map((post) => {
        const {_id: postId, author, title, image: {url}, body, tags, savesCount, likesCount, createdAt, updatedAt} = post
        const {_id: authorId, avatar: {url: avatarUrl}, username} = author

        const isLiked = post.usersLiked.some((id) => id.toString() === currentUserId.toString())
        const isSomewhereSaved = currentUser.collections.some(({posts}) => posts.find((id) => id.toString() === postId.toString()))

        const savesInfo = currentUser.collections.map(({title, posts, _id}) => {
            const isPostInCollection = posts.find((id) => id.toString() === postId.toString())

            if (isPostInCollection) {
                return {title, collectionId: _id, isSaved: true}
            } else {
                return {title, collectionId: _id, isSaved: false}
            }
        })


        const validatedAuthor = {_id: authorId, avatar: avatarUrl, username}
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

    res.status(200).json({
        code: 200,
        status: 'success',
        data: {
            posts: validatedPosts
        }
    })
}


module.exports = getAll