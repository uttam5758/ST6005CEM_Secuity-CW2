const express = require('express')
const upload = require('../middleware/upload');
const user_controller = require('../controllers/user_controller')
const delivery_controller = require('../controllers/delivery_controller')
const { verifyUser, verifyAdmin } = require('../middleware/auth')

const router = express.Router()

router.route('/')
    .post(upload.single('image'), user_controller.registerUser)
    .get(verifyUser, verifyAdmin, user_controller.getAllUsers)

router.route('/login')
    .post(user_controller.loginUser)

router.route('/:user_id')
    .get(user_controller.getUserData)
    .put(upload.single('image'), verifyUser, user_controller.updateUser)

router.route('/:user_id/update-password')
    .put(verifyUser, user_controller.updatePassword)

module.exports = router