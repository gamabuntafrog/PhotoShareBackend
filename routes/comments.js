const express = require('express')
const {ctrlWrapper, auth, validateObjectId} = require("../middlewares");
const {posts: ctrl, comments: commentsCtrl} = require('../controllers')
const router = express.Router()


router.post('/posts/:id', validateObjectId(), ctrlWrapper(auth), ctrlWrapper(commentsCtrl.addComment))

router.post('/posts/:postId/:commentId', validateObjectId(), ctrlWrapper(auth), ctrlWrapper(commentsCtrl.addReplyToComment))

module.exports = router