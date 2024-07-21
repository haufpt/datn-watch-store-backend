const { boolean } = require("joi");
const mongoose = require("mongoose");

const shippingAddressModelSchema = mongoose.Schema(
  {
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "accounts",
    },
    title: {
      type: string,
      required: true,
    },
    address: {
      type: string,
      required: true,
    },
    phoneNumber: {
      type: string,
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
