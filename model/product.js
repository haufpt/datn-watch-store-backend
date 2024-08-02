const { types } = require("joi");
const mongoose = require("mongoose");

const productsModelSchema = mongoose.Schema(
  {
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "brands",
      required: false,
    },
    description: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    photoUrls: {
      type: Array,
      required: true,
    },
    createdDate: {
      type: Date,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    machineCategory: {
      type: String,
      required: true,
    },
    wireCategory: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      required: false
    }
  },
  { collection: "products" }
);

module.exports = mongoose.model("productsModel", productsModelSchema);
