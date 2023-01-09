const {Post, User, Collection} = require("../../models");
const {NotFound, Conflict} = require("http-errors");


const deleteFromSaved = async (req, res) => {

    const {id: postId, collectionId} = req.params
    const {_id: currentUserId} = req.user


    const post = await Post.findById(postId)
    if (!post) {
        throw new NotFound('post no exists')
    }

    const collection = await Collection.findById(collectionId)
    if (!collection) {
        throw new NotFound('collection no exists')
    }
    const isPostExistsInCollection = collection.posts.some((el) => el.toString() === postId)
    if (!isPostExistsInCollection) {
        throw new NotFound('post already not saved')
    }

    await Collection.findByIdAndUpdate(collectionId, {
        $pull: {
            posts: postId
        }
    })
    await Post.findByIdAndUpdate(postId, {
        $inc: {
            savesCount: -1
        }
    })


    res.status(204).send()
}
// видалити в користувача savedPosts та в поста usersSaved

module.exports = deleteFromSaved
