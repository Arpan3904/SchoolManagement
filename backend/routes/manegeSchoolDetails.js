const express = require('express');
const multer = require('multer');
const path = require('path');
const SchoolDetails = require('./models/SchoolDetails');
const app = express();

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Set the directory to save the files
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Fetch school details
app.get('/api/school-details', async(req, res) => {
    try {
        const schoolDetails = await SchoolDetails.findOne(); // Assuming there's only one document
        res.json(schoolDetails);
    } catch (err) {
        console.error('Error fetching school details:', err);
        res.status(500).json({ error: 'Error fetching school details' });
    }
});

// Update school details
app.put('/api/school-details', upload.single('schoolLogo'), async(req, res) => {
    try {
        let updatedFields = req.body; // Assuming form data is directly in req.body

        if (req.file) {
            updatedFields.schoolLogo = `/uploads/${req.file.filename}`;
        }

        const updatedSchoolDetails = await SchoolDetails.findOneAndUpdate({}, // Find the first document, assuming there's only one
            { $set: updatedFields }, { new: true }
        );

        res.json(updatedSchoolDetails);
    } catch (err) {
        console.error('Error updating school details:', err);
        res.status(500).json({ error: 'Error updating school details' });
    }
});

module.exports = router;