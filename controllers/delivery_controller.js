const Delivery = require("../Model/Delivery");

const Product = require("../Model/Product");

const orderDelivery = (req, res, next) => {
  let newDelivery = {
    ...req.body,
    products: req.body.products,
    deliver_userId: req.user.userId,
  };

  Delivery.create(newDelivery)
    .then((createdDelivery) => {
      // Increment purchaseCount for each product
      const productIds = req.body.products.map((product) => product.productId);
      Product.updateMany(
        { _id: { $in: productIds } },
        { $inc: { purchaseCount: 1 } }
      ).exec();

      res.status(201).json({
        status: 'Product has been ordered successfully',
        delivery: createdDelivery,
      });
    })
    .catch(next);
};



const getDeliveryData = (req, res, next) => {
  const userId = req.user.userId
  Delivery.find({
    deliver_userId: userId,
  })
  .populate({
    path: 'products.productId',
    select: 'title price image',
  })
    .then((deliveries) => {
      res.status(200).json({
        status:"success",
        deliveries,
      });
      // console.log(`the delivery data is ${deliveries}`)
    })
      .catch(next)
}

const getAllDeliveries = (req, res, next) => {
  Delivery.find()
    .populate({
      path: "products.productId",
      select: "title price image",
    })
    .then((deliveries) => {
      res.status(200).json({
        status: "success",
        deliveries,
      });
    })
    .catch(next);
};

const updateDeliveryStatus = (req, res, next) => {
  const deliveryId = req.params.deliveryId;
  const { deliveryStatus } = req.body;

  Delivery.findByIdAndUpdate(deliveryId, { deliveryStatus }, { new: true })
    .then((updatedDelivery) => {
      res.status(200).json({
        status: "success",
        delivery: updatedDelivery,
      });
    })
    .catch(next);
};

const deleteDelivery = (req, res, next) => {
  const deliveryId = req.params.deliveryId;

  Delivery.findByIdAndDelete(deliveryId)
    .then((deletedDelivery) => {
      if (!deletedDelivery) {
        return res.status(404).json({
          status: "error",
          message: "Delivery not found",
        });
      }

      res.status(200).json({
        status: "success",
        message: "Delivery deleted successfully",
      });
    })
    .catch(next);
};

module.exports = { 
    orderDelivery,
    getDeliveryData,
    getAllDeliveries,
    updateDeliveryStatus,
    deleteDelivery,
};
