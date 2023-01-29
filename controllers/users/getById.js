const {User} = require("../../models");
const {NotFound} = require("http-errors");


const getById = async (req, res) => {
    const {currentUserId} = req
    const {id} = req.params
    const {posts, collections} = req.query

    const collectionsParams = collections ? {
        path: 'collections',
        options: {
            sort: {createdAt: -1}
        },
        populate: {
            path: 'posts',
            options: {
                sort: {createdAt: -1},
                limit: 3
            },
        }
    } : null

    const user = await User.findById(id).populate(collectionsParams)

    const {
        _id: authorId,
        avatar: {url: avatarUrl},
        username,
        subscribes,
        subscribers,
        posts: userPosts,
        createdAt
    } = user

    const formattedCollections = user.collections.filter((collection) => {
        if (!collection.isPrivate) return true

        const isCurrentUserAuthorOfCollection = collection.authors
            .some(({user: _id}) => _id.toString() === currentUserId.toString())
        const isViewer = collection.viewers.some((id) => id.toString() === currentUserId.toString())

        if (isCurrentUserAuthorOfCollection || isViewer) return true

        return false
    }).map((collection) => {
        const {_id, title, posts, authors} = collection


        const formattedPosts = posts.map((post) => {
            const {_id, image: {url}} = post

            return {
                _id,
                image: url
            }
        })

        const formateedCollection = {
            _id,
            title,
            posts: formattedPosts,
            authors
        }

        return formateedCollection
    })

    const formattedUser = {
        _id: authorId,
        avatar: avatarUrl,
        username,
        subscribersCount: subscribers.length,
        subscribesCount: subscribes.length,
        postsCount: userPosts.length,
        collections: formattedCollections,
        createdAt
    }

    res.status(200).json({
        code: 200,
        status: 'success',
        data: {
            user: formattedUser,
        }
    })
}

module.exports = getById