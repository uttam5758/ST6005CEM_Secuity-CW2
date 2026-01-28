const express = require('express')
const {verify} = require('jsonwebtoken')
const product_controller = require('../controllers/product_controller')
const review_controller = require('../controllers/review_controller')
const upload = require('../middleware/upload')
const { verifyUser, verifyAdmin } = require('../middleware/auth')
const router = express.Router()

router.route('/')
    .get(product_controller.getAllProducts)
    .post(verifyUser, verifyAdmin,upload.single('image'),product_controller.createProduct)

router.route('/:id')
    .get(product_controller.getAProduct)
    .put(verifyUser, verifyAdmin, upload.single('image'), product_controller.updateProduct)
    .delete(verifyUser, verifyAdmin, product_controller.deleteAProduct)

router.route('/:id/reviews')
    .get(review_controller.getAllReviews)
    .post(verifyUser,review_controller.createReview)

router.route('/:id/reviews/:reviewId')
    .delete(verifyUser, review_controller.deleteReview)
    .put(verifyUser, verifyAdmin, review_controller.updateReview)

module.exports = router