const Joi = require('joi')
const objectId = Joi.object({
  id: Joi.string().length(24),
  collectionId: Joi.string().length(24),
  postId: Joi.string().length(24),
  commentId: Joi.string().length(24),
  replyId: Joi.string().length(24),
  authorId: Joi.string().length(24),
  viewerId: Joi.string().length(24),
  userId: Joi.string().length(24)
})

const validateObjectId = () => {
  return async (req, res, next) => {
    const { error } = objectId.validate(req.params)

    if (error) {
      error.status = 400
      next(error)
      return
    }
    next()
  }
}

module.exports = validateObjectId
