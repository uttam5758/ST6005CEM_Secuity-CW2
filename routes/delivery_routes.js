const express = require('express')
const delivery_controller = require('../controllers/delivery_controller')
const { verifyUser, verifyAdmin } = require('../middleware/auth')

const router = express.Router()

router.route('/')
    .post(verifyUser, delivery_controller.orderDelivery)
    .get(verifyUser, delivery_controller.getDeliveryData)

router.route('/:deliveryId')
    .put(verifyUser, verifyAdmin, delivery_controller.updateDeliveryStatus)
    .delete(verifyUser, verifyAdmin, delivery_controller.deleteDelivery)


router.route('/all')
    .get(verifyUser, verifyAdmin, delivery_controller.getAllDeliveries)

module.exports = router 