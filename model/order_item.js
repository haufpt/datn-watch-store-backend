const mongoose = require("mongoose");

const orderItemsModelSchema = mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "orders",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
  { collection: "order_items" }
);

module.exports = mongoose.model("order_items", orderItemsModelSchema);
