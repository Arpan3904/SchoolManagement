const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    className: { type: String, unique: true },
    classTeacher: String,
    roomNo: { type: String, unique: true },
    capacity: Number,
    principal: String,
    feeAmount: Number
}, { collection: 'class' });

// Create model using the schema
const Class = mongoose.model('Class', classSchema);

module.exports = Class;