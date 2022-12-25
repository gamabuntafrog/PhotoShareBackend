const {Post, User} = require("../../models");
const {NotFound, Conflict} = require('http-errors')

const addToSaved = async (req, res) => {
    const {id: postId} = req.params
    const {_id: userId} = req.user

    const post = await Post.findById(postId)
    if (!post) {
        throw new NotFound('Posts no exists')
    }

    const postIdIfItAlreadyExistsInSaved = req.user.savedPosts.find(pstId => pstId.toString() === postId) || null
    if (postIdIfItAlreadyExistsInSaved) {
        throw new Conflict('post already in saved')
    }

    const pushPost = await User.findByIdAndUpdate(userId, {
        $push: {
            savedPosts: postId
        }
    })

    const incrementCount = await User.findByIdAndUpdate(userId, {
        $inc: {
            savesCount: 1
        }
    })

    res.status(201).json({
        status: 'success',
        code: 201,
        data: post
    })

}

module.exports = addToSaved