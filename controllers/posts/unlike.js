const {Conflict} = require("http-errors");
const {Post, User} = require("../../models");

const unlike = async (req, res) => {
    const {id: postId} = req.params
    const {_id: userId} = req.user

    const post = await Post.findById(postId)

    if (!post) {
        throw new Conflict('Post does not exist')
    }

    const postIfItAlreadyExistsInUser = req.user.likedPosts.find(({_id}) => _id.toString() === postId)

    if (!postIfItAlreadyExistsInUser) {
        throw new Conflict('Post already not liked')
    }

    const updatedPost = await Post.findByIdAndUpdate(postId, {
        $inc: {
            likesCount: -1
        },
        $pull: {
            usersLiked: userId
        },
        new: true
    })

    const removePostFromUserLiked = await User.findByIdAndUpdate(userId, {
        $pull: {
            likedPosts: postId
        }
    })


    res.status(200).json({
        code: 200,
        status: 'success',
        data: {
            post: updatedPost
        }
    })
}

module.exports = unlike