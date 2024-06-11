const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');
const Notice = require('../models/notice');

router.use(bodyParser.json());

router.get('/fetchNotice', async(req, res) => {
    try {
        const notices = await Notice.find({});
        res.status(200).json(notices);
    } catch (err) {
        console.error('Error fetching notices:', err);
        res.status(500).json({ error: 'An error occurred while fetching notices.' });
    }
});


module.exports = router;