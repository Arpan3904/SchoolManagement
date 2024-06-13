// teacherAttendance.js

const mongoose = require('mongoose');

const teacherAttendanceSchema = new mongoose.Schema({
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
    date: { type: String, required: true },
    present: { type: Boolean, required: true }
}, { collection: 'teacherAttendance' });

const TeacherAttendance = mongoose.model('TeacherAttendance', teacherAttendanceSchema);

module.exports = TeacherAttendance;
