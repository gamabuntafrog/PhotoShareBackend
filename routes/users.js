const express = require('express');
const router = express.Router();
const {users: ctrl, notifications: notificationsCtrl} = require('../controllers');
const {ctrlWrapper, auth, validateObjectId, validate} = require('../middlewares')
const {updateUserValidationSchema} = require("../shemas/user");



router.get('/:id/allowedToViewCollections', ctrlWrapper(auth), ctrlWrapper(ctrl.getAllowedToViewCollections))

router.get('/search', ctrlWrapper(ctrl.getUsersByUsername));

router.get('/search/forAddInCollection', ctrlWrapper(auth), ctrlWrapper(ctrl.getUsersForAddInCollection))

router.get('/search/forSearchBar', ctrlWrapper(ctrl.getUsersForSearchBar))

router.get('/current', ctrlWrapper(auth), ctrlWrapper(ctrl.getCurrent))

router.patch('/current', ctrlWrapper(auth), validate(updateUserValidationSchema), ctrlWrapper(ctrl.updateCurrent))

router.get('/:id', validateObjectId(), ctrlWrapper(auth), ctrlWrapper(ctrl.getById))

router.post('/:id/subscribes', validateObjectId(), ctrlWrapper(auth), ctrlWrapper(ctrl.addToSubscribes))

router.delete('/:id/subscribes', validateObjectId(), ctrlWrapper(auth), ctrlWrapper(ctrl.deleteFromSubscribes))

router.get('/subscribes', ctrlWrapper(auth), ctrlWrapper(ctrl.getSubscribes))


module.exports = router;
