const {Post} = require('../../models')

const getAll = async (req, res) => {

    const posts = await Post.find().sort({createdAt: -1}).populate({
        path: 'author'
    })

    const filteredPosts = posts.filter(post => post.author !== null)

    res.status(200).send({
        code: 200,
        status: 'success',
        data: {
            posts: filteredPosts
        }
    })
}


module.exports = getAll