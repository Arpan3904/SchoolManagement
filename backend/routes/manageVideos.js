const express = require('express');
const router = express.Router();
const Video = require('../models/video');

router.get('/videos', async(req, res) => {
    try {
        const videos = await Video.find();
        res.json(videos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/videos', async(req, res) => {
    const { url, title } = req.body;

    const embedUrl = convertToEmbedUrl(url);

    const video = new Video({
        url: embedUrl,
        title: title
    });

    try {
        const newVideo = await video.save();
        res.status(201).json(newVideo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

function convertToEmbedUrl(youtubeUrl) {

    const videoId = youtubeUrl.split('/').pop().split('?')[0];
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    return embedUrl;
}

router.delete('/videos/:id', async(req, res) => {
    try {
        const video = await Video.findByIdAndDelete(req.params.id);
        if (video == null) {
            return res.status(404).json({ message: 'Cannot find video' });
        }
        res.json({ message: 'Deleted video' });
    } catch (err) {
        console.error('Error occurred while deleting video:', err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;