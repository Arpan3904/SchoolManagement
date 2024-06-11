const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
    class: {
        type: String,
            required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    materialLink: {
        type: String,
        required: true,
    },
    uploadedAt: {
        type: Date,
        default: Date.now,
    },
});

const Material = mongoose.model('Material', materialSchema);
module.exports = Material;