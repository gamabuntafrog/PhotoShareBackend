const {Collection} = require("../../models");

const getCollectionsByTitle = async (req, res) => {
    const {currentUserId} = req
    const {title} = req.query

    const match = {
        $or: [
            {
                title: {
                    $regex: title
                }
            },
            {
                tags: {
                    $elemMatch: {
                        $regex: title
                    }
                },
            }
        ]
    }

    const collections = await Collection.find({
        $or: [{isPrivate: false, ...match}, {viewers: [currentUserId], ...match}, {'authors.user': currentUserId, ...match}],
    }).populate({
        path: 'posts',
        options: {
            sort: {createdAt: -1},
            limit: 3
        },
    }).limit(50)

    const formattedCollections = collections.filter((collection) => {
        if (!collection.isPrivate) return true

        const isCurrentUserAuthorOfCollection = collection.authors
            .some(({user: _id}) => _id.toString() === currentUserId.toString())
        const isViewer = collection.viewers.some((id) => id.toString() === currentUserId.toString())

        if (isCurrentUserAuthorOfCollection || isViewer) return true

        return false
    }).map((collection) => {
        const {_id, title, posts, authors} = collection


        const formattedPosts = posts.map((post) => {
            console.log(post)
            const {_id, image: {url}} = post

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
        status: 'success',
        code: 200,
        data: {
            collections: formattedCollections
        }
    })
}

module.exports = getCollectionsByTitle