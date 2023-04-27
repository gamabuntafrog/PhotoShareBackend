const { Types } = require('mongoose')

const paginationQuery = (query) => {
  const { arrayOfId = [] } = query
  const parsedArrayOfId = JSON.parse(arrayOfId).map((el) => new Types.ObjectId(el))

  const limit = 15

  return { arrayOfId: parsedArrayOfId, limit }
}

module.exports = paginationQuery
