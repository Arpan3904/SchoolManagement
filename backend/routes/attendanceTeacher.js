const express = require('express');
const router = express.Router();
const Teacher = require('../server');
const TeacherAttendance = require('../models/teacherAttendance');


// Fetch all teachers
router.get('/api/fetch-teachers', async (req, res) => {
    try {
        const teachers = await Teacher.find();
        res.status(200).json(teachers);
    } catch (error) {
        console.error('Error fetching teachers:', error);
        res.status(500).json({ message: 'Failed to fetch teachers' });
    }
});

// Fetch teacher attendance for a specific date
router.get('/api/fetch-teacher-attendance', async (req, res) => {
    const { date } = req.query;
    try {
        const attendance = await TeacherAttendance.find({ date });
        res.status(200).json(attendance);
    } catch (error) {
        console.error('Error fetching teacher attendance:', error);
        res.status(500).json({ message: 'Failed to fetch teacher attendance' });
    }
});

// Save or update teacher attendance
router.post('/api/save-teacher-attendance', async (req, res) => {
    const { date, teachers } = req.body; // teachers is an array of { teacherId, present }
    try {
        for (const teacherAttendance of teachers) {
            await TeacherAttendance.findOneAndUpdate(
                { teacherId: teacherAttendance.teacherId, date },
                { present: teacherAttendance.present },
                { upsert: true, new: true }
            );
        }
        res.status(201).json({ message: 'Attendance saved successfully' });
    } catch (error) {
        console.error('Error saving teacher attendance:', error);
        res.status(500).json({ message: 'Failed to save attendance' });
    }
});



module.exports = router;
