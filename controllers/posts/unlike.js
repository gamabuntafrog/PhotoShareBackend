const {Conflict} = require("http-errors");
const {Post, User, Notification} = require("../../models");
const translate = require("../../utils/language/translate");
const notificationTypes = require("../../utils/notificationTypes");

const unlike = async (req, res) => {
    const {id: postId} = req.params
    const {currentUserId} = req
    const {language = ''} = req.headers

    const t = translate(language)
    const post = await Post.findById(postId)

    if (!post) {
        throw new Conflict(t('postNotFound'))
    }

    const postIfItAlreadyExistsInUser = req.user.likedPosts.find(({_id}) => _id.toString() === postId)

    if (!postIfItAlreadyExistsInUser) {
        throw new Conflict(t('postNotLiked'))
    }

    const updatedPost = await Post.findByIdAndUpdate(postId, {
        $inc: {
            likesCount: -1
        },
        $pull: {
            usersLiked: currentUserId
        },
        new: true
    })

    const removePostFromUserLiked = await User.findByIdAndUpdate(currentUserId, {
        $pull: {
            likedPosts: postId
        }
    })

    await Notification.create({
        userRef: currentUserId,
        receiver: post.author,
        type: notificationTypes.unlikePost,
        postRef: postId
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