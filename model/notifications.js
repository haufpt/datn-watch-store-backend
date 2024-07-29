const mongoose = require("mongoose");

const notificationsModelSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  { collection: "notifications" }
);

module.exports = mongoose.model("notificationsModel", notificationsModelSchema);
