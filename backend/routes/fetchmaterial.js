const express = require('express');
const router = express.Router();
const Material = require('../models/Material');

router.get('/materials', async(req, res) => {
    const { class: className, subject: subjectName } = req.query;
    console.log(className);
    console.log(subjectName);

    if (!className || !subjectName) {
        return res.status(400).json({ error: 'Class and subject are required.' });
    }

    try {
        const materials = await Material.find({ class: className, subject: subjectName });
        console.log(materials);
        res.json(materials);
    } catch (err) {
        console.error('Error fetching materials:', err);
        res.status(500).json({ error: 'An error occurred while fetching materials.' });
    }
});

module.exports = router;