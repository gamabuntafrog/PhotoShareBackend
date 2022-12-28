
const express = require('express')
const {ctrlWrapper, auth, validateObjectId} = require("../middlewares");
const router = express.Router()

const {collections: collectionsCtrl}= require('../controllers')

router.get('/', ctrlWrapper(auth), ctrlWrapper(collectionsCtrl.getCurrent))

router.post('/', ctrlWrapper(auth), ctrlWrapper(collectionsCtrl.create))

module.exports = router