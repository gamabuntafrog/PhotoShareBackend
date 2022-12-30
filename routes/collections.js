
const express = require('express')
const {ctrlWrapper, auth, validateObjectId} = require("../middlewares");
const router = express.Router()

const {collections: collectionsCtrl, ctrl}= require('../controllers')

router.get('/', ctrlWrapper(auth), ctrlWrapper(collectionsCtrl.getCurrent))

router.get('/:id', validateObjectId(), ctrlWrapper(auth), ctrlWrapper(collectionsCtrl.getPopulatedCollection))

router.patch('/:id/like', validateObjectId(), ctrlWrapper(auth), ctrlWrapper(collectionsCtrl.likePostInCollection))

router.patch('/:id/unlike', validateObjectId(), ctrlWrapper(auth), ctrlWrapper(collectionsCtrl.unlikePostInCollection))

router.patch('/:id/save', validateObjectId(), ctrlWrapper(auth), ctrlWrapper(collectionsCtrl.savePostInCollection))

router.patch('/:id/unsave', validateObjectId(), ctrlWrapper(auth), ctrlWrapper(collectionsCtrl.unsavePostInCollection))

router.post('/', ctrlWrapper(auth), ctrlWrapper(collectionsCtrl.create))

module.exports = router