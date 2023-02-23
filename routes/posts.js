const express = require('express')
const {ctrlWrapper, auth, validateObjectId, validate} = require("../middlewares");
const {posts: ctrl, commentsToPost: commentsCtrl} = require('../controllers')
const {addPostValidationSchema, tagsValidationSchema} = require("../shemas/post");
const router = express.Router()

router.get('/', ctrlWrapper(auth), ctrlWrapper(ctrl.getAll))

router.get('/search', ctrlWrapper(auth), ctrlWrapper(ctrl.getByTitle))

router.get('/tags/:id', ctrlWrapper(auth), ctrlWrapper(ctrl.getByTags))

router.get('/collections/:id', ctrlWrapper(auth), validateObjectId(), ctrlWrapper(ctrl.getPostsByCollectionId))

router.get('/users/:id', ctrlWrapper(auth), ctrlWrapper(ctrl.getPostsByUserId))

router.get('/:id', ctrlWrapper(auth), ctrlWrapper(ctrl.findOneById))

router.post('/', validate(addPostValidationSchema), ctrlWrapper(auth), ctrlWrapper(ctrl.createPost))

router.delete('/:id', validateObjectId(), ctrlWrapper(auth), ctrlWrapper(ctrl.deletePost))

router.patch('/:id/like', validateObjectId(), ctrlWrapper(auth), ctrlWrapper(ctrl.like))

router.patch('/:id/unlike', validateObjectId(), ctrlWrapper(auth), ctrlWrapper(ctrl.unlike))

router.post('/:id/comments', validateObjectId(), ctrlWrapper(auth), ctrlWrapper(commentsCtrl.addComment))


module.exports = router