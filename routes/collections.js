
const express = require('express')
const {ctrlWrapper, auth, validateObjectId, validate, validateRole} = require("../middlewares");
const router = express.Router()

const {collections: collectionsCtrl, ctrl}= require('../controllers')
const {collectionValidationSchema} = require("../shemas/collection");
const {roleValidationSchema} = require("../shemas");

router.get('/', ctrlWrapper(auth), ctrlWrapper(collectionsCtrl.getCollections))

router.get('/current', ctrlWrapper(auth), ctrlWrapper(collectionsCtrl.getCurrent))

router.get('/search', ctrlWrapper(auth), ctrlWrapper(collectionsCtrl.getCollectionsByTitle))

router.get('/:id', validateObjectId(), (auth), ctrlWrapper(collectionsCtrl.getPopulatedCollection))

router.post('/:collectionId/requests', validateObjectId(), ctrlWrapper(auth), ctrlWrapper(collectionsCtrl.sendRequestToJoinToCollection))

router.delete('/:collectionId/requests', validateObjectId(), ctrlWrapper(auth), ctrlWrapper(collectionsCtrl.unsendRequestToJoinFromCollection))

router.post('/:collectionId/saves/:postId', validateObjectId(), ctrlWrapper(auth), ctrlWrapper(collectionsCtrl.savePostInCollection))

router.delete('/:collectionId/saves/:postId', validateObjectId(), ctrlWrapper(auth), ctrlWrapper(collectionsCtrl.deletePostFromCollection))

router.post('/:collectionId/authors/:authorId', validateObjectId(), ctrlWrapper(auth), validateRole(roleValidationSchema), ctrlWrapper(collectionsCtrl.addAuthorToCollection))

router.delete('/:collectionId/authors/:authorId', validateObjectId(), ctrlWrapper(auth), ctrlWrapper(collectionsCtrl.deleteAuthorFromCollection))

router.patch('/:collectionId/authors/:authorId/roles', validateObjectId(), ctrlWrapper(auth), validateRole(roleValidationSchema), ctrlWrapper(collectionsCtrl.changeAuthorRole))

router.delete('/:collectionId/current', validateObjectId(), ctrlWrapper(auth), ctrlWrapper(collectionsCtrl.deleteCurrentUserFromCollection))

router.post('/:collectionId/viewers/:viewerId', validateObjectId(), ctrlWrapper(auth), ctrlWrapper(collectionsCtrl.addViewerToCollection))

router.delete('/:collectionId/viewers/:viewerId', validateObjectId(), ctrlWrapper(auth), ctrlWrapper(collectionsCtrl.deleteViewerFromCollection))

router.post('/', validate(collectionValidationSchema), ctrlWrapper(auth), ctrlWrapper(collectionsCtrl.createCollection))

router.patch('/:id', ctrlWrapper(auth), validate(collectionValidationSchema), ctrlWrapper(collectionsCtrl.changeCollectionInfo))

router.patch('/:id/isPrivate', ctrlWrapper(auth), ctrlWrapper(collectionsCtrl.changeIsPrivate))

router.delete('/:id', validateObjectId(), ctrlWrapper(auth), ctrlWrapper(collectionsCtrl.deleteCollection))

module.exports = router