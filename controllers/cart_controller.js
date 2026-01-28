const Product = require('../Model/Product');
const User = require('../Model/User');

const viewCart = (req, res, next) => {
    const userId = req.user.userId; // Change this line according to your authentication method
  
    User.findById(userId)
      .populate('cart.productId') // Populate the product details in the cart
      .then((user) => {
        res.json(user.cart);
      })
      .catch(next);
};

const addToCart = (req, res, next) => {
    const { productId } = req.body; // Assuming you have a productId in the request body
  
    // Assuming you have a way to identify the currently logged-in user, you can get the user ID like this:
    const userId = req.user.userId; // Change this line according to your authentication method
  
    // Find the product by ID
    Product.findById(productId)
      .then((product) => {
        if (!product) {
          return res.status(404).json({ error: 'Product not found' });
        }
  
        // Update the user's cart with the new product
        return User.findByIdAndUpdate(
          userId,
          { $push: { cart: { productId: productId } } },
          { new: true }
        )
          .populate('cart.productId') // Populate the product details in the cart
          .then((user) => {
            res.json({
              status: 'Product has been successfully added to the cart',
              user,
            });
          });
      })
      .catch(next);
};

const removeFromCart = (req, res, next) => {
  const { cartItemId } = req.body; // Assuming you have a cartItemId in the request body

  // Assuming you have a way to identify the currently logged-in user, you can get the user ID like this:
  const userId = req.user.userId; // Change this line according to your authentication method

  // Remove the specified cart item from the user's cart
  User.findByIdAndUpdate(
    userId,
    { $pull: { cart: { _id: cartItemId } } },
    { new: true }
  )
    .populate('cart.productId') // Populate the product details in the cart
    .then((user) => {
      res.json({
        status: 'Item has been successfully removed from the cart',
        user,
      });
    })
    .catch(next);
};

module.exports = {
    viewCart,
    addToCart,
    removeFromCart,
};
