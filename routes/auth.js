const express = require('express');
const router = express.Router();
const {auth: ctrl} = require('../controllers');
const {ctrlWrapper, auth} = require('../middlewares')
const {validate} = require('../middlewares')
const {register} = require('../shemas')

router.post('/register', validate(register), ctrlWrapper(ctrl.register))

router.post('/login', ctrlWrapper(ctrl.login))

router.post('/logout', ctrlWrapper(auth), ctrlWrapper(ctrl.logout))
module.exports = router

