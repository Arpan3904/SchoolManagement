const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    class: String,
    subjectName: String,
    subjectCode: { type: String, unique: true }
}, { collection: "subject" });

const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;