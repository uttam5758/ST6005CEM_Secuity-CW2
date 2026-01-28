const Delivery = require("../Model/Delivery");
const Product = require("../Model/Product");

const getAllReviews = (req, res, next) => {
    Product.findById(req.params.id)
        .then((product) => {
            res.json(product.reviews)
        })
        .catch(next)
}

const createReview = (req, res, next) => {
  const userId = req.user.userId;
  const productId = req.params.id;

  // Check if the user has ordered the product
  Delivery.findOne({ deliver_userId: userId, 'products.productId': productId })
      .then((delivery) => {
          if (!delivery) {
              return res.status(403).json({ message: 'You are not authorized to create a review for this product' });
          }

          // The user has ordered the product, proceed with creating the review
          Product.findById(productId)
              .then((product) => {
                  let review = {
                      "body": req.body.body,
                      "rating": req.body.rating,
                      "reviewer_id": userId,
                      "reviewerName": req.user.fullname,
                  }
                  product.reviews.push(review);
                  product.save()
                      .then((b) => res.status(201).json(b.reviews))
                      .catch(next);
              })
              .catch(next);
      })
      .catch(next);
};

const deleteReview = (req, res, next) => {
    const productId = req.params.id;
    const reviewId = req.params.reviewId;
    // console.log(productId)

    Product.findById(productId)
      .then((product) => {
        const reviewIndex = product.reviews.findIndex((review) => review._id == reviewId);
        if (reviewIndex === -1) {
          return res.status(404).json({ message: 'Review not found' });
        }
        if (product.reviews[reviewIndex].reviewer_id.toString() !== req.user.userId && req.user.role !== 'Admin') {
          return res.status(403).json({ message: 'You are not authorized to delete this review' });
        }
        product.reviews.splice(reviewIndex, 1);
       product.save()
          .then(() => res.status(204).end())
          .catch(next);
      })
      .catch(next);
  };

  const updateReview = (req, res, next) => {
    const productId = req.params.id;
    const reviewId = req.params.reviewId;
  
    Product.findById(productId)
      .then((product) => {
        const reviewIndex = product.reviews.findIndex((review) => review._id == reviewId);
        if (reviewIndex === -1) {
          return res.status(404).json({ message: 'Review not found' });
        }
        if (product.reviews[reviewIndex].reviewer_id.toString() !== req.user.userId && req.user.role !== 'Admin') {
          return res.status(403).json({ message: 'You are not authorized to edit this review' });
        }
        const updatedReview = {
          body: req.body.body,
          rating: req.body.rating,
        };
        product.reviews[reviewIndex] = { ...product.reviews[reviewIndex], ...updatedReview };
        product.save()
          .then(() => res.json(product.reviews))
          .catch(next);
      })
      .catch(next);
  };

module.exports = {
    getAllReviews,
    createReview,
    deleteReview,
    updateReview,
}