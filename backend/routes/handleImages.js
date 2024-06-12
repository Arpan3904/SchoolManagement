const express = require('express');
const router = express.Router();
const Image = require('../models/Image');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/getImages', async(req, res) => {
    const { eventId } = req.query;

    if (!eventId) {
        return res.status(400).json({ error: 'Event ID is required.' });
    }

    try {
        const images = await Image.find({ eventId });
        res.json({ images });
    } catch (err) {
        console.error('Error fetching images:', err);
        res.status(500).json({ error: 'An error occurred while fetching images.' });
    }
});

router.post('/addImage', upload.single('image'), async(req, res) => {
    const { eventId } = req.body;
    const imageData = req.file.buffer.toString('base64');

    if (!eventId || !imageData) {
        return res.status(400).json({ error: 'Event ID and image data are required.' });
    }

    try {
        const image = new Image({ imageData, eventId });
        await image.save();
        res.status(201).json({ message: 'Image uploaded successfully.' });
    } catch (err) {
        console.error('Error uploading image:', err);
        res.status(500).json({ error: 'An error occurred while uploading the image.' });
    }
});

module.exports = router;