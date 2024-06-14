const express = require('express');
const router = express.Router();
const Prayer = require('../models/prayer');

// Get all prayers
router.get('/prayers', async(req, res) => {
    try {
        const prayers = await Prayer.find();
        res.json(prayers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a prayer by day
router.put('/prayers/:day', async(req, res) => {
    const { day } = req.params;
    const { link } = req.body;

    try {
        const prayer = await Prayer.findOneAndUpdate({ day }, { link }, { new: true, upsert: true });
        res.json(prayer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;