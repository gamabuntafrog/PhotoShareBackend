const cloudinary = require('../../utils/cloudinary')
const { User } = require('../../models')
const { log } = require('debug')
const translate = require('../../utils/language/translate')

const updateCurrent = async (req, res) => {
  const { currentUser, currentUserId } = req
  const { id: publicAvatarId } = currentUser.avatar
  const { avatar: avatarFile } = req.body
  const { language = '' } = req.headers

  const t = translate(language)

  if (avatarFile) {
    if (publicAvatarId) {
      await cloudinary.uploader.destroy(publicAvatarId)
    }

    const result = await cloudinary.uploader.upload(avatarFile, {
      folder: 'avatars',
      width: 400
    })

    const newAvatarInfo = {
      url: result.secure_url,
      id: result.public_id
    }

    req.body.avatar = newAvatarInfo
  } else {
    delete req.body.avatar
  }

  const updatedUser = await User.findByIdAndUpdate(currentUserId, req.body)

  res.status(201).json({
    code: 201,
    status: 'success',
    message: t('profileUpdated'),
    data: {
      user: updatedUser
    }
  })
}

module.exports = updateCurrent
