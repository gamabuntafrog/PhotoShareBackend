const {Post, User} = require("../../models");
const {NotFound, Conflict} = require("http-errors");


const deleteFromSaved = async (req, res) => {

    const {id} = req.params
    const {_id: userId} = req.user

    const post = await Post.findById(id)
    if (!post) {
        throw new NotFound('post no exists')
    }

    const postIdIfItAlreadyExistsInSaved = req.user.savedPosts.find(postId => postId.toString() === id) || null
    if (!postIdIfItAlreadyExistsInSaved) {
        throw new Conflict('post already not in saved')
    }

    const deletePostFromSaved = await User.findByIdAndUpdate(userId, {
        $pull: {
            savedPosts: postIdIfItAlreadyExistsInSaved
        }
    })

    const decrementCount = await User.findByIdAndUpdate(userId, {
        $inc: {
            savesCount: -1
        }
    })

    res.status(204).send()


}


module.exports = deleteFromSaved
