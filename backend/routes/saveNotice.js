const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');
const Notice = require('../models/notice');

router.use(bodyParser.json());

router.post('/saveNotice', async(req, res) => {
    try {
        const { title, content, targetClasses, targetAudience, additionalInfo } = req.body;
        console.log();

        const newNotice = new Notice({
            title,
            content,
            targetClasses,
            targetAudience,
            additionalInfo
        });

        // Save the notice to the database
        await newNotice.save();
        res.status(201).json({ message: 'Notice saved successfully!' });
    } catch (err) {
        console.error('Error saving notice:', err);
        res.status(500).json({ error: 'An error occurred while saving the notice.' });
    }
});

module.exports = router;