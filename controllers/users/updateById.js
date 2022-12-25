
const cloudinary = require('../../utils/cloudinary')
const {User} = require('../../models')
const {log} = require("debug");

const updateById = async (req, res) => {
    const {user: currentUser} = req
    const {id: publicAvatarId, url} = currentUser.avatar
    const {avatar: avatarFile} = req.body


    if (avatarFile) {
        if (publicAvatarId) {
            await cloudinary.uploader.destroy(publicAvatarId)
        }

        const result = await cloudinary.uploader.upload(avatarFile, {
            folder: 'avatars',
            width: 400
        })

        const avatar = {
            url: result.secure_url,
            id: result.public_id
        }

        req.body.avatar = avatar
    } else {
        delete req.body.avatar
    }

    const updatedUser = Object.assign(currentUser, req.body)
    await updatedUser.save()

    res.status(201).json(updatedUser)
}

module.exports = updateById