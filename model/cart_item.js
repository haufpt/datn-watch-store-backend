const mongoose = require("mongoose");

const cardItemModelSchema = mongoose.Schema(
  {
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "accounts",
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
  { collection: "cart_items" }
);

module.exports = mongoose.model("cartItemsModel", cardItemModelSchema);
