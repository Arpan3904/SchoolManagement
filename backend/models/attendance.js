// models/attendance.js

const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    classId: String,
    date: { type: Date, default: Date.now },
    students: [{
        studentId: String,
        present: Boolean
    }]
}, { collection: 'attendance' });

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
