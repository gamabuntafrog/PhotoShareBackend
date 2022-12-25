const express = require('express')
const {ctrlWrapper, auth, validateObjectId} = require("../middlewares");
const {posts: ctrl, commentsToPost: commentsCtrl} = require('../controllers')
const router = express.Router()


router.post('/:id', validateObjectId(), ctrlWrapper(auth), ctrlWrapper(commentsCtrl.addReplyToComment))

module.exports = router