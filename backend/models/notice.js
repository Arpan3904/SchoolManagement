const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the notice
const noticeSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },

    targetClasses: {
        type: [String],
        required: true
    },
    targetAudience: {
        type: String,
        required: true,
        enum: ['students', 'teachers', 'both']
    },
    additionalInfo: {
        type: String
    }
});


// Create and export the Notice model
const Notice = mongoose.model('Notice', noticeSchema);
module.exports = Notice;