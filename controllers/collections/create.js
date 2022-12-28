const {Collection} = require("../../models");


const create = async (req, res) => {
    const {user: {_id: currentUserId}} = req
    console.log(req.body)

    const collection = await Collection.create({author: currentUserId, ...req.body})

    res.status(201).json({
        status: 'success',
        code: 201,
        data: {
            collection
        }
    })
}

module.exports = create