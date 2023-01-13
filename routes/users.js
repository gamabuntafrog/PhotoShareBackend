const express = require('express');
const router = express.Router();
const {users: ctrl, notifications: notificationsCtrl} = require('../controllers');
const {ctrlWrapper, auth, validateObjectId, validate} = require('../middlewares')
const {updateUserValidationSchema} = require("../shemas/user");

router.get('/', ctrlWrapper(ctrl.getAll));

router.get('/current', ctrlWrapper(auth), ctrlWrapper(ctrl.getCurrent))

router.patch('/current', ctrlWrapper(auth), validate(updateUserValidationSchema), ctrlWrapper(ctrl.updateCurrent))

router.get('/notifications', ctrlWrapper(auth), ctrlWrapper(notificationsCtrl.getOne))

router.get('/notifications/all', ctrlWrapper(auth), ctrlWrapper(notificationsCtrl.getAll))

router.get('/:id', validateObjectId(), ctrlWrapper(auth), ctrlWrapper(ctrl.getById))

router.post('/:id/subscribes', validateObjectId(), ctrlWrapper(auth), ctrlWrapper(ctrl.addToSubscribes))

router.delete('/:id/subscribes', validateObjectId(), ctrlWrapper(auth), ctrlWrapper(ctrl.deleteFromSubscribes))

router.get('/subscribes', ctrlWrapper(auth), ctrlWrapper(ctrl.getSubscribes))




module.exports = router;
