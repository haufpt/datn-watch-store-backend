const { required } = require("joi");
const mongoose = require("mongoose");

const discountsModelSchema = mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    createdDate: {
      type: Date,
      required: true,
    },
    expirationDate: {
      type: Date,
      required: false,
    },
    discountType: {
      type: String,
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      required: false,
    },
  },
  { collection: "discounts" }
);

module.exports = mongoose.model("discounts", discountsModelSchema);
