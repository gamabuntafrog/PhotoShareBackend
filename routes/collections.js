
const express = require('express')
const {ctrlWrapper, auth, validateObjectId} = require("../middlewares");
const router = express.Router()

const {collections: collectionsCtrl}= require('../controllers')

router.get('/', ctrlWrapper(auth), ctrlWrapper(collectionsCtrl.getCurrent))

router.get('/:id', validateObjectId(), ctrlWrapper(auth), ctrlWrapper(collectionsCtrl.getPopulatedCollection))

router.post('/', ctrlWrapper(auth), ctrlWrapper(collectionsCtrl.create))

module.exports = router