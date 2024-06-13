const express = require('express');
const router = express.Router();
const Student = require('../models/Student'); 
const Homework = require('../models/Homework'); 
router.get('/fetchStudents', async (req, res) => {
  try {
    const { date, class: className } = req.query;

    // Find students belonging to the selected class
    const students = await Student.find({ className });

    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch students' });
  }
});


module.exports = router;
