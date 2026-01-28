const Product = require('../Model/Product')
const User = require('../Model/User')

const getAllProducts = (req, res, next) => {
    Product.find()
        .then((products) => {
            res.json(products)
        }).catch(next)
}

const createProduct = (req, res, next) => {
  const product = {
    title: req.body.title,
    price: req.body.price
  }

  if (req.file) {
    product.image = req.file.filename
  } else if (req.body.image) {
    product.image = req.body.image
  }

  Product.create(product)
    .then((product) => {
      res.status(201).json({
        status: "Product has been successfully added",
        product
      })
    })
    .catch(next)
}



const updateProduct = (req, res, next) => {
    let productUpdates = {};
    if (req.body.title) {
      productUpdates.title = req.body.title;
    }
    if (req.body.price) {
      productUpdates.price = req.body.price;
    }
    if (req.file) {
      productUpdates.image = req.file.filename;
    }
    Product.findById(req.params.id)
      .then((product) => {
        if (!req.file) {
          // If no image is provided, retain the existing image
          productUpdates.image = product.image;
        }
        return Product.findByIdAndUpdate(req.params.id, productUpdates, { new: true });
      })
      .then((updatedProduct) => {
        res.json({
          status: 'Product has been successfully updated',
          product: updatedProduct,
        });
      })
      .catch(next);
  };

  const deleteAProduct = (req, res, next) => {
    Product.findByIdAndRemove(req.params.id)
      .then(() => {
        res.json({ status: 'Product has been successfully deleted' });
      })
      .catch(next);
  };
  
const getAProduct = (req, res, next) => {
    Product.findById(
        req.params.id,
    )
    .then((product) => {
        res.json(product)
    }).catch(next)
}

// const addToCart = (req, res, next) => {
//     const {productId, quantity} = req.body;
//     const userId = req.user.userId;

//     User.findByIdAndUpdate(
//         userId,
//         { $push: { cart: { productId, quantity } } },
//         { new: true }
//       )
//         .populate('cart.productId') // Populate the product details in the cart
//         .then((user) => {
//           res.json({
//             status: 'Product has been successfully added to the cart',
//             user,
//           });
//         })
//         .catch(next);
// }

module.exports = {
    getAllProducts,
    createProduct,
    updateProduct,
    getAProduct,
    deleteAProduct,
}