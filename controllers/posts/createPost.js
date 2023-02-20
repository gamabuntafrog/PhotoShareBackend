const {Post, Collection, User} = require('../../models')
const cloudinary = require("../../utils/cloudinary");
const translate = require("../../utils/language/translate");


const createPost = async (req, res) => {
    const {currentUserId} = req
    const {image: imageFile, collectionId} = req.body
    const {language = ''} = req.headers

    const t = translate(language)

    const result = await cloudinary.uploader.upload(imageFile, {
        folder: 'photos',
        width: 1280
    })

    const image = {
        url: result.secure_url,
        id: result.public_id
    }

    const post = await Post.create({
        ...req.body, author: currentUserId, image
    })

    await Collection.findByIdAndUpdate(collectionId, {
        $push: {
            posts: post._id
        }
    })

    await User.findByIdAndUpdate(currentUserId, {
        $push: {
            posts: post._id,
            savedPosts: {post: post._id, collection: collectionId},
        }
    })

    res.status(201).json({
        code: 201,
        status: 'success',
        message: t('postCreated'),
        data: {
            post
        }
    })
}

module.exports = createPost