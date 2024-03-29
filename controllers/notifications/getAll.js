const { Notification } = require('../../models')
const notificationTypes = require('../../utils/notificationTypes')

const getAll = async (req, res) => {
  const { currentUserId } = req

  const notifications = await Notification.find({ receiver: currentUserId })
    .sort({ createdAt: -1 })
    .populate('userRef')
    .populate('postRef')
    .populate('collectionRef')
    .populate('commentRef')
    .populate('subCommentRef')
    .limit(100)

  const validatedNotifications = notifications.map((notification) => {
    const {
      type,
      checked,
      receiver,
      userRef,
      postRef = null,
      collectionRef = null,
      commentRef = null,
      subCommentRef = null
    } = notification
    const {
      username,
      avatar: { url },
      _id
    } = userRef

    const user = typeof userRef === 'string' ? { _id: userRef } : { _id, username, avatarURL: url }

    if (type === notificationTypes.subscribe || type === notificationTypes.unsubscribe) {
      return { checked, type, user, _id }
    }

    if (
      type === notificationTypes.likePost ||
      type === notificationTypes.unlikePost ||
      type === notificationTypes.savePost
    ) {
      const post = postRef
        ? typeof postRef === 'string'
          ? { _id: postRef }
          : {
              _id: postRef._id,
              image: postRef.image.url
            }
        : null

      return { checked, type, user, post, _id }
    }

    if (
      type === notificationTypes.addUserToCollection ||
      type === notificationTypes.deleteUserFromCollection ||
      type === notificationTypes.changeUserRoleInCollection ||
      type === notificationTypes.acceptJoinToCollectionRequest ||
      type === notificationTypes.declineJoinToCollectionRequest
    ) {
      const collection = collectionRef
        ? typeof collectionRef === 'string'
          ? { _id: collectionRef }
          : {
              _id: collectionRef._id,
              title: collectionRef.title
            }
        : null

      return { checked, type, user, collection, _id }
    }

    if (type === notificationTypes.addCommentToPost && commentRef && postRef) {
      const { _id: commentId, text } = commentRef
      const {
        _id: postId,
        image: { url }
      } = postRef

      return {
        checked,
        type,
        user,
        _id,
        post: { _id: postId, image: url },
        comment: { text, _id: commentId }
      }
    }

    if (type === notificationTypes.addReplyToComment && subCommentRef && postRef) {
      const { _id: subCommentId, text } = subCommentRef
      const {
        _id: postId,
        image: { url }
      } = postRef

      return {
        checked,
        type,
        user,
        _id,
        post: { _id: postId, image: url },
        comment: { text, _id: subCommentId }
      }
    }

    return { checked, type, user, _id }
  })

  res.status(200).json({
    code: 200,
    status: 'success',
    data: {
      notifications: validatedNotifications
    }
  })
}

module.exports = getAll
