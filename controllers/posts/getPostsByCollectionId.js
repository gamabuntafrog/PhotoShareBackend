const {Collection, User} = require("../../models");
const {NotFound} = require("http-errors");
const translate = require("../../utils/language/translate");


const getPostsByCollectionId = async (req, res) => {
    const {id: collectionId} = req.params
    const {currentUserId} = req
    const {arrayOfId = '[]'} = req.query
    const parsedArrayOfId = JSON.parse(arrayOfId)
    const {language = ''} = req.headers

    const t = translate(language)

    const collection = await Collection.findById(collectionId).populate({
        path: 'posts',
        options: {
            sort: {createdAt: -1}
        },
        populate: 'author'
    })

    if (!collection) {
        throw new NotFound(t('collectionNotFound'))
    }

    const filteredPosts = collection.posts.filter(({_id}) => !parsedArrayOfId.find((id) => id === _id.toString()))
    const slicedPosts = filteredPosts.slice(0, 15)

    const currentUser = await User.findById(currentUserId).populate('collections')

    const validatedPosts = slicedPosts.map((post) => {
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
        status: 'success',
        code: 200,
        data: {
            posts: validatedPosts,
        }
    })
}

module.exports = getPostsByCollectionId