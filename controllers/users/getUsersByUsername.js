const {User} = require("../../models");


const getUsersByUsername = async (req, res) => {

    const {username} = req.query

    const users = await User.find({
        username: {
            $regex: username,
            $options: 'i'
        },
    }).limit(50)

    const validatedUsers = users.map((user) => {
        const {
            _id,
            avatar: {url: avatarUrl},
            username,
            subscribes,
            subscribers,
            posts,
            collections
        } = user

        return {
            _id,
            avatar: avatarUrl,
            username,
            subscribesCount: subscribes.length,
            subscribersCount: subscribers.length,
            postsCount: posts.length,
            collectionsCount: collections.length
        }
    })

    res.status(200).send({
        code: 200,
        status: 'success',
        data: {
            users: validatedUsers
        }
    })
}

module.exports = getUsersByUsername