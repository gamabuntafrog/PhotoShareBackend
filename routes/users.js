const express = require('express');
const router = express.Router();
const {users: ctrl, notifications: notificationsCtrl} = require('../controllers');
const {ctrlWrapper, auth, validateObjectId} = require('../middlewares')

router.get('/', ctrlWrapper(ctrl.getAll));

router.get('/current', ctrlWrapper(auth), ctrlWrapper(ctrl.getCurrent))

router.get('/notifications', ctrlWrapper(auth), ctrlWrapper(notificationsCtrl.getOne))

router.get('/notifications/all', ctrlWrapper(auth), ctrlWrapper(notificationsCtrl.getAll))

router.get('/:id', validateObjectId(), ctrlWrapper(auth), ctrlWrapper(ctrl.getById))

router.post('/:id/subscribes', validateObjectId(), ctrlWrapper(auth), ctrlWrapper(ctrl.addToSubscribes))

router.delete('/:id/subscribes', validateObjectId(), ctrlWrapper(auth), ctrlWrapper(ctrl.deleteFromSubscribes))

router.get('/subscribes', ctrlWrapper(auth), ctrlWrapper(ctrl.getSubscribes))

router.patch('/avatars', ctrlWrapper(auth), ctrlWrapper(ctrl.changeAvatar))

router.patch('/', ctrlWrapper(auth), ctrlWrapper(ctrl.updateById))


module.exports = router;
