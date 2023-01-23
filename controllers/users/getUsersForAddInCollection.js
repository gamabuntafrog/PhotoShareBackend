const {User} = require("../../models");


const getUsersForAddInCollection = async (req, res) => {

    const {username, collectionId} = req.query

    const users = await User.find({
        // find by username
        username: {
            $regex: username
        },
        // find users which not authors of this collection
        collections: {
            $ne: collectionId
        }
    })

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

module.exports = getUsersForAddInCollection