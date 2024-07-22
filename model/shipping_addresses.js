const { boolean } = require("joi");
const mongoose = require("mongoose");

const shippingAddressModelSchema = mongoose.Schema(
  {
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "accounts",
    },
    title: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    isDefault: {
      type: boolean,
      required: false,
    },
  },
  { collection: "shipping_addresses" }
);

module.exports = mongoose.model(
  "shippingAddressModel",
  shippingAddressModelSchema
);
