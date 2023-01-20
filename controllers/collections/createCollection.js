const {Collection} = require("../../models");


const createCollection = async (req, res) => {
    const {user: currentUser} = req
    const {_id: currentUserId} = currentUser

    console.log(req.body)

    const collection = await Collection.create({authors: [currentUserId], ...req.body})
    currentUser.collections.push(collection._id)
    await currentUser.save()

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