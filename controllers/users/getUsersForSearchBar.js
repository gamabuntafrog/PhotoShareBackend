const {User, Collection} = require("../../models");


const getUsersForSearchBar = async (req, res) => {

    const {username} = req.query

    const users = await User.find({
        username: {
            $regex: username
        },
    }).limit(10)

    const validatedAuthors = users.map(({_id, avatar: {url: avatarUrl}, username}) => {
        return {_id, avatar: avatarUrl, username}
    })

    res.status(200).send({
        code: 200,
        status: 'success',
        data: {
            users: validatedAuthors
        }
    })
}

module.exports = getUsersForSearchBar