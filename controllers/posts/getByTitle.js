const {Post} = require('../../models')



const getByTitle = async (req, res) => {

    const posts = await Post.find({
        title: {
            $regex: req.params.title
        }
    })
    console.log(posts)
    if (!posts) {
        let error = new Error(`posts no exists`)
        error.status = 404
        throw error
    }

    res.status(200).send({
        code: 200,
        status: 'success',
        data: {
            posts
        }
    })
}

module.exports = getByTitle
