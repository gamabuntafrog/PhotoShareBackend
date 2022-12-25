const {Post} = require('../../models')

const addOne = async (req, res) => {
    const {user} = req
    const {_id} = user

    const post = await Post.create({
        ...req.body, author: _id
    })

    user.posts.push(post._id)
    await user.save()

    res.status(201).send({
        code: 201,
        status: 'success',
        data: {
            post
        }
    })
}
//
module.exports = addOne