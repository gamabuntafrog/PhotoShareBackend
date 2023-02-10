const {Post, User} = require('../../models')



const getByTitle = async (req, res) => {
    const {currentUserId} = req
    const {title} = req.query

    const posts = await Post.find({
        title: {
            $regex: title
        }
    }).sort({createdAt: -1}).populate({
        path: 'author',
        populate: {
            path: 'collections'
        }
    })

    const currentUser = await User.findById(currentUserId).populate('collections')

    // .filter(post => post.author !== null)
    const validatedPosts = posts.map((post) => {
        const {_id: postId, author, title, image: {url}, body, tags, savesCount, likesCount} = post
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
        const validatedPost = {_id: postId, author: validatedAuthor, title, image: url, body, tags, savesCount, likesCount, isLiked, isSomewhereSaved, savesInfo}

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

module.exports = getByTitle
