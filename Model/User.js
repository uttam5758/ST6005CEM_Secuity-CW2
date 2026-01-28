const mongoose = require("mongoose");

// const cartItemSchema = mongoose.Schema({
//     productId: {
//         encryptedProduct: { type: String },
//         iv: { type: String },
//     }
// });

const cartItemSchema = mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }
});

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: [5, 'Username should be longer than 5 characters']
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    fullname: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    role: {
        type: String,
        enum: ['Admin', 'User'],
        default: 'User'
    },
    delivery: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Delivery'
    },
    failedLoginAttempts: {
        type: Number,
        default: 0,
    },
    lastFailedLogin : {
        type: Date,
        default: null,
    },
    cart: [cartItemSchema],
}, {timestamps: true})

module.exports = mongoose.model('User', userSchema)