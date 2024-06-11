const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');
const Event = require('../models/event');

router.use(bodyParser.json());

router.get('/showEvents', async(req, res) => {
    try {
        const events = await Event.find({});
        res.status(200).json(events);
    } catch (err) {
        console.error('Error fetching events:', err);
        res.status(500).json({ error: 'An error occurred while fetching events.' });
    }
});


router.delete('/cancelEvent/:eventId', async(req, res) => {
    const { eventId } = req.params;
    try {
        await Event.findByIdAndDelete(eventId);
        res.status(200).json({ message: 'Event canceled successfully' });
    } catch (err) {
        console.error('Error canceling event:', err);
        res.status(500).json({ error: 'An error occurred while canceling the event.' });
    }
});

module.exports = router;