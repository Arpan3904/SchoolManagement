const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');
const Event = require('../models/event');

router.use(bodyParser.json());

router.post('/saveEvent', async(req, res) => {
    try {
        const { title, description, startDate, endDate, location } = req.body;

        // Create a new event object
        const newEvent = new Event({
            title,
            description,
            startDate,
            endDate,
            location
        });

        await newEvent.save();

        res.status(201).json({ message: 'Event added successfully', event: newEvent });
    } catch (error) {
        console.error('Error adding event:', error);
        res.status(500).json({ message: 'Failed to add event' });
    }
});

module.exports = router;