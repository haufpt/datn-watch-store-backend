const mongoose = require('mongoose');

const userModelSchema = mongoose.Schema(
    {
        userName: {
            type: String,
            required: true,
        },
        passWord: {
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
            require: true
        },
        avtUrl: {
            type: String,
            require: true
        },
        role: {
            type: String,
            require: true
        },
        firebaseNotifications: [
          {
            deviceId: { type: String, required: true },
            token: { type: String, required: true },
            osPlatform: { type: String, required: true },
          },
        ]
    },
    { collection: 'User' }
);

module.exports = mongoose.model('User', userModelSchema);
