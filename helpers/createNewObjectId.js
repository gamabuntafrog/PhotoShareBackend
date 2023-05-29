const { Types } = require("mongoose")

const createNewObjectId = () => new Types.ObjectId()

module.exports = createNewObjectId
