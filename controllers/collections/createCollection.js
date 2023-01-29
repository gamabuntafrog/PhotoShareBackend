const {Collection, User} = require("../../models");


const createCollection = async (req, res) => {
    const {currentUserId} = req

    const collection = await Collection.create({authors: [{user: currentUserId, roles: ['ADMIN']}], ...req.body})

    await User.findByIdAndUpdate(currentUserId, {
        $push: {
            collections: collection._id
        }
    })

    res.status(201).json({
        status: 'success',
        code: 201,
        message: 'Collection created',
        data: {
            collection
        }
    })
}

module.exports = createCollection