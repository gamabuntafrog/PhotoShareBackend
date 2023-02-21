const express = require('express');
const router = express.Router();
const {notifications: ctrl} = require('../controllers');
const {ctrlWrapper, auth, validateObjectId, validate} = require('../middlewares')

router.get('/', ctrlWrapper(auth), ctrlWrapper(ctrl.getAll))

router.patch('/', ctrlWrapper(auth), ctrlWrapper(ctrl.getAll))


module.exports = router