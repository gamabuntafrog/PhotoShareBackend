const {Post, User, Collection, Notification} = require("../../models");
const {Conflict, NotFound} = require("http-errors");
const translate = require("../../utils/language/translate");
const notificationTypes = require("../../utils/notificationTypes");


const savePostInCollection = async (req, res) => {
    const {postId, collectionId} = req.params
    const {language = ''} = req.headers
    const {currentUserId} = req

    const t = translate(language)

    const post = await Post.findById(postId)
    if (!post) {
        throw new NotFound(t('postNotFound'))
    }

    const collection = await Collection.findById(collectionId)
    if (!collection) {
        throw new NotFound(t('collectionNotFound'))
    }

    const isPostExistsInCollection = collection.posts.some((el) => el.toString() === postId)
    if (isPostExistsInCollection) {
        throw new NotFound(t('postAlreadySaved'))
    }

    await Collection.findByIdAndUpdate(collectionId, {
        $push: {
            posts: postId
        }
    })

    await Post.findByIdAndUpdate(postId, {
        $inc: {
            savesCount: 1
        }
    })
    const isUserAuthorOfCollection = collection.authors.some(({user: userId}) => userId.toString() === currentUserId.toString())
    if (!isUserAuthorOfCollection) {
        await Notification.create({
            userRef: currentUserId,
            receiver: post.author,
            type: notificationTypes.savePost,
            collectionRef: collectionId
        })
    }


    res.status(201).json({
        status: 'success',
        code: 201,
        message: t('successfullySaved'),
        data: {
            post: post
        }
    })
}

module.exports = savePostInCollection