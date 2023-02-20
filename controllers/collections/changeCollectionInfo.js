const Collection = require("../../models/collection");
const findOutIsCurrentUserAdmin = require("./middlewares/findOutIsCurrentUserAdmin");
const {Conflict, NotFound} = require("http-errors");
const translate = require("../../utils/language/translate");


const changeCollectionInfo = async (req, res) => {
    const {title, tags} = req.body
    const {currentUserId} = req
    const {id} = req.params
    const {language = ''} = req.headers

    const t = translate(language)
    const collection = await Collection.findById(id)

    if (!collection) {
        throw new NotFound(t('collectionNotFound'))
    }

    if (!findOutIsCurrentUserAdmin(collection.authors, currentUserId)) {
        throw new Conflict(t('dontHavePermission'))
    }

    await Collection.findByIdAndUpdate(id, {
        title,
        tags
    })

    res.status(202).json({
        status: 'success',
        code: 202,
        message: t('successfullyChanged')
    })
}

module.exports = changeCollectionInfo