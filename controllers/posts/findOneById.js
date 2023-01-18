const {Post, Collection} = require('../../models')
const {log} = require("debug");

const findOneById = async (req, res) => {
    const {currentUserId} = req
    const {id: postId} = req.params

    const post = await Post.findById(postId).populate({
        path: 'author',
        populate: {
            path: 'collections'
        }
    }).populate({
        path: 'comments',
        populate: {
            path: 'replies'
        }
    })

    const {_id, author, title, image: {url}, body, tags, savesCount, likesCount} = post
    const {_id: authorId, avatar: {url: avatarUrl}, username, subscribers} = author

    const isLiked = post.usersLiked.some((id) => id.toString() === currentUserId.toString())
    const isSomewhereSaved = author.collections.some(({posts}) => posts.find((id) => id.toString() === postId.toString()))

    const savesInfo = author.collections.map(({title, posts, _id}) => {
        const isPostInCollection = posts.find((id) => id.toString() === postId.toString())

        if (isPostInCollection) {
            return {title, collectionId: _id, isSaved: true}
        } else {
            return {title, collectionId: _id, isSaved: false}
        }
    })

    const validatedAuthor = {_id: authorId, avatar: avatarUrl, username, subscribersCount: subscribers.length}
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

    res.status(200).send({
        code: 200,
        status: 'success',
        data: {
            post: validatedPost
        }
    })
}

module.exports = findOneById