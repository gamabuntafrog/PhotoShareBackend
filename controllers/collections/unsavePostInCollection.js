const {Conflict} = require("http-errors");
const {Post, User} = require("../../models");

const unsavePostInCollection = async (req, res) => {
    const {id: postId} = req.params
    const {_id: userId} = req.user

    const postIfItAlreadyExistsInUser = req.user.savedPosts.find(({_id}) => _id.toString() === postId)

    if (!postIfItAlreadyExistsInUser) {
        throw new Conflict('post already not liked')
    }

    const removeSaveFromPost = await Post.findByIdAndUpdate(postId, {
        $pull: {
            usersSaved: userId
        }
    })

    const removePostFromSavedPosts = await User.findByIdAndUpdate(userId, {
        $pull: {
            savedPosts: postId
        }
    })


    res.status(204).send()
}

module.exports = unsavePostInCollection