
const express = require('express')
const {ctrlWrapper, auth, validateObjectId, validate} = require("../middlewares");
const router = express.Router()

const {collections: collectionsCtrl, ctrl}= require('../controllers')
const {collectionValidationSchema} = require("../shemas/collection");

router.get('/', ctrlWrapper(auth), ctrlWrapper(collectionsCtrl.getCurrent))

router.get('/:id', validateObjectId(), ctrlWrapper(auth), ctrlWrapper(collectionsCtrl.getPopulatedCollection))

router.post('/:collectionId/saves/:postId', validateObjectId(), ctrlWrapper(auth), ctrlWrapper(collectionsCtrl.savePostInCollection))

router.delete('/:collectionId/saves/:postId', validateObjectId(), ctrlWrapper(auth), ctrlWrapper(collectionsCtrl.deletePostFromCollection))

router.post('/:collectionId/authors/:authorId', validateObjectId(), ctrlWrapper(auth), ctrlWrapper(collectionsCtrl.addAuthorToCollection))

router.delete('/:collectionId/authors/:authorId', validateObjectId(), ctrlWrapper(auth), ctrlWrapper(collectionsCtrl.deleteAuthorFromCollection))

router.delete('/:collectionId/authors', validateObjectId(), ctrlWrapper(auth), ctrlWrapper(collectionsCtrl.deleteCurrentUserFromCollection))

router.post('/', validate(collectionValidationSchema), ctrlWrapper(auth), ctrlWrapper(collectionsCtrl.createCollection))

router.delete('/:id', validateObjectId(), ctrlWrapper(auth), ctrlWrapper(collectionsCtrl.deleteCollection))

module.exports = router