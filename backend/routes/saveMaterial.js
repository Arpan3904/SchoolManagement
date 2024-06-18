const express = require('express');
const router = express.Router();
const Material = require('../models/material'); // Adjust the path as necessary

// Route to save material data
router.post('/saveMaterials', async(req, res) => {
    try {
        const { className, subject, materialLink } = req.body;

        if (!className || !subject || !materialLink) {
            return res.status(400).json({ message: 'Class, subject, and material link are required' });
        }

        const newMaterial = new Material({ class: className, subject, materialLink });

        await newMaterial.save();

        res.status(201).json({ message: 'Material saved successfully', material: newMaterial });
    } catch (error) {
        console.error('Error saving material:', error);
        res.status(500).json({ message: 'Failed to save material' });
    }
});

module.exports = router;