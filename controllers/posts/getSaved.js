const {User} = require("../../models");


const getSaved = async (req, res) => {

    const {savedPosts} = await User.findById(req.user._id).populate({
        path: 'savedPosts',
        populate: {
            path: 'author'
        }
    })

    res.status(200).send({
        code: 200,
        status: 'success',
        data: {
            savedPosts
        }
    })
}

module.exports = getSaved