const express = require('express')
const {ctrlWrapper, auth, validateObjectId, validate} = require("../middlewares");
const {posts: ctrl, commentsToPost: commentsCtrl} = require('../controllers')
const {addPostValidationSchema} = require("../shemas/post");
const router = express.Router()

router.get('/', ctrlWrapper(auth), ctrlWrapper(ctrl.getAll))

router.get('/my', ctrlWrapper(auth), ctrlWrapper(ctrl.getMy))

router.get('/saved', ctrlWrapper(auth), ctrlWrapper(ctrl.getSaved))

router.get('/:id', ctrlWrapper(auth), ctrlWrapper(ctrl.findOneById))

router.get('/authors/:username', ctrlWrapper(ctrl.findByUsername))

router.get('/tags/:tag', ctrlWrapper(ctrl.findByTags))

router.get('/titles/:title', ctrlWrapper(ctrl.getByTitle))

router.post('/', validate(addPostValidationSchema), ctrlWrapper(auth), ctrlWrapper(ctrl.createPost))

router.delete('/:id', validateObjectId(), ctrlWrapper(auth), ctrlWrapper(ctrl.deletePost))

router.patch('/:id/like', validateObjectId(), ctrlWrapper(auth), ctrlWrapper(ctrl.like))

router.patch('/:id/unlike', validateObjectId(), ctrlWrapper(auth), ctrlWrapper(ctrl.unlike))


router.post('/:id/comments', validateObjectId(), ctrlWrapper(auth), ctrlWrapper(commentsCtrl.addComment))


module.exports = router