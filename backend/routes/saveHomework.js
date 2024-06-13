const express = require('express');
const router = express.Router();
const Homework = require('../models/homework');
const Class = require('../models/class');

router.post('/addHomework', async(req, res) => {
    try {
        const { date, classId, subjectId, title, description, questionLink } = req.body;

        console.log(questionLink);
        const classInfo = await Class.findOne({ className: classId });
        const cId = classInfo._id;

        const newHomework = new Homework({
            date,
            classId: cId,
            subjectId,
            title,
            description,
            questionLink
        });

        await newHomework.save();

        res.status(201).json({ success: true, message: 'Homework added successfully' });
    } catch (error) {
        console.error('Error adding homework:', error);
        res.status(500).json({ success: false, message: 'Failed to add homework' });
    }
});

module.exports = router;