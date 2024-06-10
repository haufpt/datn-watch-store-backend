const mongoose = require('mongoose');

const brandsModelSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        logo: {
            type: String,
            required: true,
        }
    },
    { collection: 'brands' }
);

module.exports = mongoose.model('brands', brandsModelSchema);
