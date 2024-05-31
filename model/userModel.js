const mongoose = require('mongoose');

const userModelSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        passwd: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        fullname: {
            type: String,
            required: true,
        }
    },
    { collection: 'User' }
);

module.exports = mongoose.model('userModel', userModelSchema);
