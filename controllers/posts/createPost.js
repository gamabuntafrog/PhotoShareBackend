const {Post, Collection, User} = require('../../models')
const cloudinary = require("../../utils/cloudinary");


const createPost = async (req, res) => {
    const {currentUserId} = req
    const {image: imageFile, collectionId} = req.body

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
            // collections:

        }
    })


    res.status(201).send({
        code: 201,
        status: 'success',
        message: 'Post created',
        data: {
            post
        }
    })
}

module.exports = createPost