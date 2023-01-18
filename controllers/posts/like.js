const {Post, User} = require("../../models");
const {Conflict} = require("http-errors");


const like = async (req, res) => {
    const {id: postId} = req.params
    const {_id: userId} = req.user

    const postIfItAlreadyExistsInUser = req.user.likedPosts.find(({_id}) => _id.toString() === postId)

    if (postIfItAlreadyExistsInUser) {
        throw new Conflict('post already liked')
    }

    const updatedPost = await Post.findByIdAndUpdate(postId, {
        $inc: {
            likesCount: 1
        },
        $push: {
            usersLiked: userId
        },
        new: true
    })

    const addPostInUserLiked = await User.findByIdAndUpdate(userId, {
        $push: {
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

module.exports = like