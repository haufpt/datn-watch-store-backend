const mongoose = require("mongoose");

const ordersModelSchema = mongoose.Schema(
  {
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "accounts",
      required: false,
    },
    shippingAddressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "shipping_addresses",
      required: false,
    },
    discountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "discounts",
      required: false,
    },
    code: {
      type: String,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    discountAmount: {
      type: Number,
      required: false,
    },
    orderDate: {
      type: Date,
      required: true,
    },
    estDeliveryDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: false,
    },
    code: {
      type: String,
      required: true,
    },
  },
  { collection: "orders" }
);

module.exports = mongoose.model("orders", ordersModelSchema);
