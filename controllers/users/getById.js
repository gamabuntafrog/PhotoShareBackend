const {User} = require("../../models");
const {NotFound} = require("http-errors");
const translate = require("../../utils/language/translate");


const getById = async (req, res) => {
    const {currentUserId} = req
    const {id} = req.params
    const {language = ''} = req.headers

    const t = translate(language)

    const user = await User.findById(id)

    if (!user) {
        throw new NotFound(t('notFound'))
    }

    const {
        _id: authorId,
        avatar: {url: avatarUrl},
        username,
        subscribes,
        subscribers,
        posts: userPosts,
        createdAt
    } = user

    const formattedUser = {
        _id: authorId,
        avatar: avatarUrl,
        username,
        subscribersCount: subscribers.length,
        subscribesCount: subscribes.length,
        postsCount: userPosts.length,
        createdAt,
        canViewAllowedToViewCollections: id.toString() === currentUserId.toString()
    }

    res.status(200).json({
        code: 200,
        status: 'success',
        data: {
            user: formattedUser,
        }
    })
}

module.exports = getById