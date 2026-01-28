require('dotenv').config()
const express = require('express')
const logger = require('./logger')
const cors = require('cors')
const mongoose = require('mongoose')
const user_router = require('./routes/user_routes')
const product_router = require('./routes/product_routes')
const cart_router = require('./routes/cart_routes')
const delivery_router = require('./routes/delivery_routes')

const app = express()

app.use((req,res,next) => {
    // console.log(`${req.method} ${req.path}`)
    logger.log(`${req.method}\t${req.path}`)
    next()
})

app.use(cors())

const DB_URI = process.env.DB_URI;

console.log(DB_URI)

mongoose.connect(DB_URI)
    .then(() => {       
        console.log('connected')
    }).catch((err) => console.log(err))

app.use(express.json())

app.use('/user', user_router)
app.use('/products', product_router)
app.use('/cart', cart_router)
app.use('/delivery', delivery_router)
app.use('/image', express.static('uploads'))

app.use((err, req, res, next) => {
    console.log(err.stack)
    if (res.statusCode == 200) res.status(500)
    res.json({"msg": err.message})
    logger.log(err.message)
})

module.exports = app