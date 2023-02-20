const {Post, User, Collection} = require("../../models");
const {Conflict, NotFound} = require("http-errors");
const translate = require("../../utils/language/translate");


const savePostInCollection = async (req, res) => {
    const {postId, collectionId} = req.params
    const {language = ''} = req.headers

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