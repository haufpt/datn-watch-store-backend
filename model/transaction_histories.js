const mongoose = require("mongoose");

const transactionHistoriesModelSchema = mongoose.Schema(
  {
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "accounts",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { collection: "transaction_histories" }
);

module.exports = mongoose.model(
  "transaction_histories",
  transactionHistoriesModelSchema
);
