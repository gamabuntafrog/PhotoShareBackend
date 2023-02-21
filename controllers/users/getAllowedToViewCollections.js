const {User} = require("../../models");
const {Unathorized} = require('http-errors')
const translate = require("../../utils/language/translate");

const getAllowedToViewCollections = async (req, res) => {
    const {id} = req.params
    const {currentUserId} = req
    const {language = ''} = req.headers

    const t = translate(language)

    if (currentUserId.toString() !== id.toString()) {
        throw new Unathorized(t('dontHavePermission'))
    }

    const {allowedToViewCollections} = await User.findById(id).populate({
        path: 'allowedToViewCollections',
        populate: {
            path: 'posts',
            options: {
                sort: {createdAt: -1},
                limit: 3
            },
        }
    })

    const formattedCollectionForView = allowedToViewCollections.map((collection) => {
        const {_id, title, posts, authors} = collection

        const formattedPosts = posts.map((post) => {
            const {_id, image: {url}} = post

            return {
                _id,
                image: url
            }
        })

        const formattedCollection = {
            _id,
            title,
            posts: formattedPosts,
            authors,
        }

        return formattedCollection
    })

    res.status(200).json({
        code: 200,
        status: 'success',
        data: {
            allowedToViewCollections: formattedCollectionForView
        }
    })
}

module.exports = getAllowedToViewCollections