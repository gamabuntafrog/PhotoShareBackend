const {Post} = require('../../models')


const findByUsername = async (req, res) => {

    const post = await Post.find({author: req.params.username})

    res.status(200).send({
        code: 200,
        status: 'success',
        data: {
            post
        }
    })
}

module.exports = findByUsername