const {Post, User} = require("../../models");
const {Conflict} = require("http-errors");


const savePostInCollection = async (req, res) => {
    const {id: postId} = req.params
    const {_id: userId} = req.user
    console.log(userId)


    res.status(204).send()
}

module.exports = savePostInCollection