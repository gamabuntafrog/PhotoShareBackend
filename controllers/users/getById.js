const {User} = require("../../models");
const {NotFound} = require("http-errors");


const getById = async (req, res) => {
    const {currentUserId} = req
    const {id} = req.params

    const user = await User.findById(id)

    if (!user) {
        throw new NotFound('Not found')
    }

    const {
        _id: authorId,
        avatar: {url: avatarUrl},
        username,
        subscribes,
        subscribers,
        posts: userPosts,
        createdAt
    } = user

    const formattedUser = {
        _id: authorId,
        avatar: avatarUrl,
        username,
        subscribersCount: subscribers.length,
        subscribesCount: subscribes.length,
        postsCount: userPosts.length,
        createdAt,
        canViewAllowedToViewCollections: id.toString() === currentUserId.toString()
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