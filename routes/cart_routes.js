const express = require("express")
const { verifyUser } = require("../middleware/auth");
const upload = require('../middleware/upload')
const cartController = require("../controllers/cart_controller");
const router = express.Router()

router.route('/')
    .get(verifyUser, cartController.viewCart)

router.route('/addToCart')
    .put(verifyUser, cartController.addToCart)

router.route('/removeFromCart/')
    .delete(verifyUser, cartController.removeFromCart)

module.exports = router