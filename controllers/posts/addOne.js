const {Post} = require('../../models')
const cloudinary = require("../../utils/cloudinary");

const addOne = async (req, res) => {
    const {user} = req
    const {_id} = user
    const {image: imageFile} = req.body

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

    console.log(req.body)
    const post = await Post.create({
        ...req.body, author: _id
    })

    user.posts.push(post._id)
    await user.save()

    res.status(201).send({
        code: 201,
        status: 'success',
        data: {
            post
        }
    })
}
//
module.exports = addOne