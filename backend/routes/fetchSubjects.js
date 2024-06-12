const express = require('express');
const router = express.Router();
const Subject = require('../models/subject');


router.get('/subjects', async (req, res) => {
    const { class: className } = req.query;
  
    try {
      // Validate className if necessary before querying the database
  
      const subjects = await Subject.find({ class: className });
  
      if (!subjects) {
        // Handle case where no subjects are found for the given class
        return res.status(404).json({ message: 'No subjects found for the given class' });
      }
  
      // Return the found subjects
      res.json(subjects);
    } catch (err) {
      console.error('Error fetching subjects:', err);
      res.status(500).json({ message: 'Failed to fetch subjects' });
    }
  });

module.exports = router;