const Post = require("../../models/post");
const {User} = require("../../models");


const deletePost = async (req, res) => {
    const {id: postId} = req.params
    const {user: currentUser} = req

    const isCurrentUserAuthorOfPost = currentUser.posts.some((_id) => _id.toString() === postId)

    if (!isCurrentUserAuthorOfPost) {
        throw new Conflict('user is not author of post')
    }

    await User.findByIdAndUpdate(currentUser._id, {
        $pull: {
            posts: postId
        }
    })

    await Post.findByIdAndDelete(postId)

    res.status(204).send()
}

module.exports = deletePost