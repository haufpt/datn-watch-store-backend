const mongoose = require("mongoose");

const reviewsModelSchema = mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
      required: true,
    },
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "accounts",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    photoUrls: {
      type: Array,
      required: false,
    },
    rate: {
      type: Number,
      required: false,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { collection: "reviews" }
);

module.exports = mongoose.model("reviews", reviewsModelSchema);
