const express = require('express');
const router = express.Router();
const Homework = require('../models/homework');
const Subject = require('../models/subject');


// Endpoint to fetch homework for a student based on date and class ID
router.get('/fetchStudentHomework', async(req, res) => {
    try {
        const { date, classId, email } = req.query;
        console.log(date);
        console.log(classId);
        console.log("hello");
        console.log(email);
        // Convert the date string to a Date object
        const selectedDate = new Date(date);

        const student = await student.findOne({ email });
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        console.log(student);

        // Find homework assignments for the given date and class ID
        const homeworkList = await Homework.find({
            classId: classId,
            date: {
                $gte: selectedDate.setHours(0, 0, 0, 0),
                $lt: selectedDate.setHours(23, 59, 59, 999)
            }
        }).populate('subjectId', 'subjectName');

        console.log("after");
        console.log(homeworkList);

        if (!homeworkList || homeworkList.length === 0) {
            return res.status(404).json({ success: false, message: 'No homework found for the selected date and class' });
        }

        // Respond with the homework details
        const formattedHomeworkList = await Promise.all(homeworkList.map(async(homework) => {
            const subject = await Subject.findById(homework.subjectId);
            const submission = homework.submissions.find(sub => sub.studentId.toString() === student._id.toString());
            return {
                ...homework.toObject(),
                subjectName: subject ? subject.subjectName : '',
                isPending: !submission // If no submission, mark as pending
            };
        }));

        // Respond with the formatted homework details
        res.status(200).json({ success: true, homework: formattedHomeworkList });

    } catch (error) {
        console.error('Error fetching student homework:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch student homework' });
    }
});

module.exports = router;