const mongoose = require("mongoose");

const deliverySchema = mongoose.Schema({
    city: {
        type: String,
        required: true,
    },
    area: {
        type: String,
        required: true,
    },
    landmark: {
        type: String,
        required: true,
    },
    contactNo: {
        type: Number,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            }
        }
    ],
    deliveryStatus: {
        type: String,
        enum: ['Ongoing', 'Delivered'],
        default: 'Ongoing'
    },
    deliver_userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
}, {timestamps: true});

module.exports = mongoose.model('Delivery', deliverySchema);
