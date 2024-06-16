const mongoose = require('mongoose');

const schoolDetailsSchema = new mongoose.Schema({
    schoolLogo: {
        type: String,
        required: true // URL of the school logo
    },
    schoolName: {
        type: String,
        required: true,
        unique: true // Ensures school name is unique
    },
    schoolEmail: {
        type: String,
        required: true,
        unique: true,
        match: [/\S+@\S+\.\S+/, 'is invalid'] // Basic email validation
    },
    schoolAddress: {
        type: String,
        required: true
    },
    schoolContactNo: {
        type: String,
        required: true,
        match: [/^\+\d{10,15}$/, 'is invalid'],
    },
    principalEmail: {
        type: String,
        required: true,
        unique: true,
        match: [/\S+@\S+\.\S+/, 'is invalid']
    }
}, { collection: 'schoolDetails' });

const SchoolDetails = mongoose.model('SchoolDetails', schoolDetailsSchema);

module.exports = SchoolDetails;