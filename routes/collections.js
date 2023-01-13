
const express = require('express')
const {ctrlWrapper, auth, validateObjectId, validate} = require("../middlewares");
const router = express.Router()

const {collections: collectionsCtrl, ctrl}= require('../controllers')
const {collectionValidationSchema} = require("../shemas/collection");

router.get('/', ctrlWrapper(auth), ctrlWrapper(collectionsCtrl.getCurrent))

router.get('/:id', validateObjectId(), ctrlWrapper(auth), ctrlWrapper(collectionsCtrl.getPopulatedCollection))

router.patch('/:id/like', validateObjectId(), ctrlWrapper(auth), ctrlWrapper(collectionsCtrl.likePostInCollection))

router.patch('/:id/unlike', validateObjectId(), ctrlWrapper(auth), ctrlWrapper(collectionsCtrl.unlikePostInCollection))

router.patch('/:id/save', validateObjectId(), ctrlWrapper(auth), ctrlWrapper(collectionsCtrl.savePostInCollection))

router.patch('/:id/unsave', validateObjectId(), ctrlWrapper(auth), ctrlWrapper(collectionsCtrl.unsavePostInCollection))

router.post('/', validate(collectionValidationSchema), ctrlWrapper(auth), ctrlWrapper(collectionsCtrl.create))

router.delete('/:id', validateObjectId(), ctrlWrapper(auth), ctrlWrapper(collectionsCtrl.deleteCollection))

module.exports = router