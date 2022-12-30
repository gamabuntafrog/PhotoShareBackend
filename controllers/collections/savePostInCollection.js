const {Post, User} = require("../../models");
const {Conflict} = require("http-errors");


const savePostInCollection = async (req, res) => {
    const {id: postId} = req.params
    const {_id: userId} = req.user
    console.log(userId)
    const postIfItAlreadyExistsInUser = req.user.savedPosts.find(({_id}) => _id.toString() === postId)

    if (postIfItAlreadyExistsInUser) {
        throw new Conflict('post already saved')
    }

    const addSaveToPost = await Post.findByIdAndUpdate(postId, {
        $push: {
            usersSaved: userId
        }
    })

    const addPostInSavedPosts = await User.findByIdAndUpdate(userId, {
        $push: {
            savedPosts: postId
        }
    })


    res.status(204).send()
}

module.exports = savePostInCollection