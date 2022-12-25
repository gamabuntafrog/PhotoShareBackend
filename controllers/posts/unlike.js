const {Conflict} = require("http-errors");
const {Post, User} = require("../../models");

const unlike = async (req, res) => {
    const {id: postId} = req.params
    const {_id: userId} = req.user

    const postIfItAlreadyExistsInUser = req.user.likedPosts.find(({_id}) => _id.toString() === postId)

    if (!postIfItAlreadyExistsInUser) {
        throw new Conflict('post already not liked')
    }

    const removeLikeFromPost = await Post.findByIdAndUpdate(postId, {
        $inc: {
            likesCount: -1
        },
        $pull: {
            usersLiked: userId
        }
    })

    const removePostFromUserLiked = await User.findByIdAndUpdate(userId, {
        $pull: {
            likedPosts: postId
        }
    })


    res.status(204).send()
}

module.exports = unlike