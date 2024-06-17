const express = require('express');
const router = express.Router();
const Attendance = require('../models/attendance');

// Save attendance
// Save attendance
router.post('/save-attendance', async (req, res) => {
    try {
        const { classId, date, students } = req.body;
        // Check if attendance for the given class and date already exists
        let attendance = await Attendance.findOne({ classId, date: new Date(date) });

        if (!attendance) {
            // If attendance does not exist, create a new one
            attendance = new Attendance({ classId, date, students });
        } else {
            // If attendance exists, update the present status for each student
            students.forEach(student => {
                const existingStudent = attendance.students.find(s => s.studentId === student.studentId);
                if (existingStudent) {
                    existingStudent.present = student.present;
                } else {
                    attendance.students.push(student); // Add new student if not already present
                }
            });
        }

        // Save the attendance record
        await attendance.save();
        res.status(201).json(attendance);
    } catch (error) {
        console.error('Error saving attendance:', error);
        res.status(500).json({ message: 'Failed to save attendance' });
    }
});


// Fetch attendance by classId and date
router.get('/fetch-attendance', async (req, res) => {
    try {
        const { classId, date } = req.query;
        const attendance = await Attendance.findOne({ classId, date: new Date(date) });
        res.status(200).json(attendance);
    } catch (error) {
        console.error('Error fetching attendance:', error);
        res.status(500).json({ message: 'Failed to fetch attendance' });
    }
});

// Fetch attendance by studentId
router.get('/api/fetch-attendance-by-teacherId', async(req, res) => {
    try {
        const { teacherId } = req.query;
        const attendance = await Attendance.find({ teacherId });
        res.status(200).json(attendance);
    } catch (error) {
        console.error('Error fetching attendance:', error);
        res.status(500).json({ message: 'Failed to fetch attendance' });
    }
});
router.get('/fetch-attendance-by-studentId', async(req, res) => {
    try {
        console.log("hphp");
        const { studentId } = req.query;
        const attendance = await Attendance.find({ 'students.studentId': studentId });
        res.status(200).json(attendance);
    } catch (error) {
        console.error('Error fetching attendance:', error);
        res.status(500).json({ message: 'Failed to fetch attendance' });
    }
  });

module.exports = router;
