const mongoose = require("mongoose");

const accountModelSchema = mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      require: true,
    },
    avatarUrl: {
      type: String,
      require: true,
    },
    role: {
      type: String,
      require: true,
    },
    firebaseNotifications: [
      {
        deviceId: { type: String, required: true },
        token: { type: String, required: true },
        osPlatform: { type: String, required: true },
      },
    ],
  },
  { collection: "accounts" }
);

module.exports = mongoose.model("accounts", accountModelSchema);
