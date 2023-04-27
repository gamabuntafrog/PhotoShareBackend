module.exports = (authors, currentUserId) =>
  authors.some(
    ({ user: userId, roles }) =>
      userId.toString() === currentUserId.toString() && roles.includes('ADMIN')
  )
