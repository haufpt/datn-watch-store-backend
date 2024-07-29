const mongoose = require("mongoose");

const notificationRecipientsModelSchema = mongoose.Schema(
  {
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "accounts",
    },
    notificationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "notifications",
    },
    isRead: {
      type: Boolean,
      required: true,
    },
  },
  { collection: "notification_recipients" }
);

module.exports = mongoose.model(
  "notificationRecipientsModel",
  notificationRecipientsModelSchema
);
