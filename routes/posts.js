const express = require('express')
const {ctrlWrapper, auth, validateObjectId, validate} = require("../middlewares");
const {posts: ctrl, commentsToPost: commentsCtrl} = require('../controllers')
const Joi = require("joi");
const {addPostValidationSchema} = require("../shemas/post");
const router = express.Router()

router.get('/', ctrlWrapper(auth), ctrlWrapper(ctrl.getAll))

router.get('/my', ctrlWrapper(auth), ctrlWrapper(ctrl.getMy))

router.get('/saved', ctrlWrapper(auth), ctrlWrapper(ctrl.getSaved))

router.get('/:id', ctrlWrapper(auth), ctrlWrapper(ctrl.findOneById))

router.get('/authors/:username', ctrlWrapper(ctrl.findByUsername))

router.get('/tags/:tag', ctrlWrapper(ctrl.findByTags))

router.get('/titles/:title', ctrlWrapper(ctrl.getByTitle))



router.post('/', validate(addPostValidationSchema), ctrlWrapper(auth), ctrlWrapper(ctrl.addOne))

router.delete('/:id', validateObjectId(), ctrlWrapper(auth), ctrlWrapper(ctrl.deletePost))

router.patch('/:id/like', validateObjectId(), ctrlWrapper(auth), ctrlWrapper(ctrl.like))

router.patch('/:id/unlike', validateObjectId(), ctrlWrapper(auth), ctrlWrapper(ctrl.unlike))

router.patch('/:id/saves/:collectionId', validateObjectId(), ctrlWrapper(auth), ctrlWrapper(ctrl.addToSaved))

router.patch('/:id/unsaves/:collectionId', validateObjectId(), ctrlWrapper(auth), ctrlWrapper(ctrl.deleteFromSaved))

router.post('/:id/comments', validateObjectId(), ctrlWrapper(auth), ctrlWrapper(commentsCtrl.addComment))


module.exports = router