const express = require('express');
const router = express.Router();
const Subject = require('../models/subject');


router.get('/subjects', async(req, res) => {
    const { class: className } = req.query;
    try {
        const subjects = await Subject.find({ class: className });
        res.json(subjects);
    } catch (err) {
        console.error('Error fetching subjects:', err);
        res.status(500).json({ message: 'Failed to fetch subjects' });
    }
});

module.exports = router;