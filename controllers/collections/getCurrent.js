const {Collection, User} = require("../../models");


const getCurrent = async (req, res) => {
    const {currentUserId} = req

    const currentUser = await User.findById(currentUserId).populate('collections')

    const {collections} = currentUser

    res.status(200).json({
        status: 'success',
        code: 200,
        data: {
            collections
        }
    })
}

module.exports = getCurrent