const {Collection, User} = require("../../models");


const getPopulatedCollection = async (req, res) => {
    const {id: collectionId} = req.params
    const {currentUserId} = req

    const collection = await Collection.findById(collectionId).populate('authors').populate({
        path: 'posts',
        options: {
            sort: {createdAt: -1}
        },
        populate: 'author'
    })

    const currentUser = await User.findById(currentUserId).populate('collections')

    const validatedAuthors = collection.authors.map(({_id: authorId, avatar: {url: avatarUrl}, username, subscribers}) => {
        return {_id: authorId, avatar: avatarUrl, username, subscribersCount: subscribers.length}
    })


    const validatedPosts = collection.posts.map((post) => {
        const isLiked = post.usersLiked.some((id) => id.toString() === currentUserId.toString())
        const isSomewhereSaved = currentUser.collections.some(({posts}) => posts.find((id) => id.toString() === post._id.toString()))

        const savesInfo = currentUser.collections.map(({title, posts, _id}) => {
            const isPostInCollection = posts.find((id) => id.toString() === post._id.toString())

            if (isPostInCollection) {
                return {title, collectionId: _id, isSaved: true}
            } else {
                return {title, collectionId: _id, isSaved: false}
            }
        })

        const {_id, author, title, image: {url}, body, tags, savesCount, likesCount} = post
        const {_id: authorId, avatar: {url: avatarUrl}, username} = author
        const validatedAuthor = {_id: authorId, avatar: avatarUrl, username}
        const validatedPost = {
            _id,
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
        satus: 'success',
        code: 200,
        data: {
            collection: {
                ...collection.toObject(),
                authors: validatedAuthors,
                posts: validatedPosts
            }
        }
    })
}

module.exports = getPopulatedCollection