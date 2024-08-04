const mongoose = require("mongoose");

const searchHistoriesModelSchema = mongoose.Schema(
  {
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "accounts",
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { collection: "search_histories" }
);

module.exports = mongoose.model("search_histories", searchHistoriesModelSchema);
