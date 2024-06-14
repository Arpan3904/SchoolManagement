const mongoose = require('mongoose');

const prayerSchema = new mongoose.Schema({
    day: {
        type: String,
        required: true,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    },
    link: {
        type: String,
        required: true
    }
});

const Prayer = mongoose.model('Prayer', prayerSchema);

module.exports = Prayer;