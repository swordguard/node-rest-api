const express = require('express')
const router = express.Router()
const checkAuth = require('../middleware/checkAuth')

const User = require('../models/user')
const UserController = require('../controllers/user')

router.get('/', checkAuth, UserController.user_get_all)

router.post('/signup', UserController.user_signup)

router.post('/login', UserController.user_login)

router.delete('/:userId', checkAuth, UserController.user_delete)

module.exports = router