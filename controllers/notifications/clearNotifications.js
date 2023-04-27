const { Notification } = require('../../models')

const clearNotifications = async (req, res) => {
  const { currentUserId } = req

  await Notification.updateMany(
    { receiver: currentUserId, checked: false },
    {
      checked: true
    }
  )

  res.status(202).json({
    code: 202,
    status: 'success'
  })
}

module.exports = clearNotifications
