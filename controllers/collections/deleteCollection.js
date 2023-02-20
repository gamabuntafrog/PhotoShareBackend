const Collection = require("../../models/collection");
const {Conflict, NotFound} = require("http-errors");
const {User} = require("../../models");
const findOutIsCurrentUserAdmin = require("./middlewares/findOutIsCurrentUserAdmin");
const translate = require("../../utils/language/translate");


const deleteCollection = async (req, res) => {
    const {id: collectionId} = req.params
    const {currentUserId} = req
    const {language = ''} = req.headers

    const t = translate(language)
    const collection = await Collection.findById(collectionId)

    if (!collection) {
        throw new NotFound(t('collectionNotFound'))
    }

    if (!findOutIsCurrentUserAdmin(collection.authors, currentUserId)) {
        throw new Conflict(t('dontHavePermission'))
    }

    await Collection.findByIdAndDelete(collectionId)

    await User.findByIdAndUpdate(currentUserId, {
        $pull: {
            collections: collectionId
        }
    })


    res.status(201).json({
        code: 201,
        status: 'success',
        message: t('successfullyDeleted')
    })
}

module.exports = deleteCollection