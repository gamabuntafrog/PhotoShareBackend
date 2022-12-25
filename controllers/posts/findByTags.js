const {Post} = require('../../models')

const findByTags = async (req, res) => {
    console.log(req.params.tag)
    const post = await Post.find({tags: {$in : [req.params.tag]}})

    res.status(200).send({
        code: 200,
        status: 'success',
        data: {
            post
        }
    })
}

module.exports = findByTags