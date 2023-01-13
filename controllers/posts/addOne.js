const {Post, Collection, User} = require('../../models')
const cloudinary = require("../../utils/cloudinary");


const addOne = async (req, res) => {
    const {user} = req
    const {_id} = user
    const {image: imageFile, collectionId} = req.body

    // throw 10

    if (imageFile) {
        const result = await cloudinary.uploader.upload(imageFile, {
            folder: 'photos',
            width: 1280
        })

        const image = {
            url: result.secure_url,
            id: result.public_id
        }

        req.body.image = image
    } else {
        delete req.body.image
    }

    const post = await Post. create({
        ...req.body, author: _id, usersSaved: [collectionId]
    })

    const collection = await Collection.findByIdAndUpdate(collectionId, {
        $push: {
            posts: post._id
        }
    })

    await User.findByIdAndUpdate(_id, {
        $push: {
            posts: post._id,
            savedPosts: {post: post._id, collection: collectionId}
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

module.exports = addOne