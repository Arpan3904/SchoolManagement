const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const Complaint = require('../models/complain');

router.use(bodyParser.json());
router.use(fileUpload()); // Enable file uploads

router.post('/addComplain', async (req, res) => {
    try {
        const { title, content, createdBy } = req.body;
        let imagePath = null;

        if (!req.files || !req.files.image) {
            return res.status(400).json({ message: 'No image uploaded or data uploaded' });
        }
        const imageFile = req.files.image;
        const imageData = imageFile.data.toString('base64');

        const newComplaint = new Complaint({
            title,
            content,
            createdBy,
            image: imageData // Save the image data to the 'image' field
        });

        // Save the complaint to the database
        await newComplaint.save();
        res.status(201).json({ message: 'Complaint saved successfully!' });
    } catch (err) {
        console.error('Error saving complaint:', err);
        res.status(500).json({ error: 'An error occurred while saving the complaint.' });
    }
});

module.exports = router;
