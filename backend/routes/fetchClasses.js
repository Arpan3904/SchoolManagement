const express = require('express');
const router = express.Router();
const Class = require('../models/class');

router.get('/classes', async(req, res) => {
    try {
        // console.log("before classes");
        const classes = await Class.find();
        res.json(classes);
    } catch (err) {
        console.error('Error fetching classes:', err);
        res.status(500).json({ message: 'Failed to fetch classes' });
    }
});

module.exports = router;