const express = require('express');
const router = express.Router();
const { parseResume } = require('../utils/resumeParser');
const Job = require('../models/Job');
const verifyToken = require('../middleware/auth');

// Upload resume
router.post('/upload-resume', verifyToken, async (req, res) => {
  console.log('Upload resume request:', { userId: req.userId });
  if (!req.files || !req.files.resume) {
    console.error('Resume upload failed: No file uploaded');
    return res.status(400).json({ error: 'No resume file uploaded' });
  }

  const resume = req.files.resume;
  console.log('Resume file received:', { name: resume.name, size: resume.size });

  try {
    const parsedData = await parseResume(resume);
    console.log('Resume uploaded and parsed:', { userId: req.userId, parsedData });
    res.json({ message: 'Resume uploaded successfully', data: parsedData });
  } catch (error) {
    console.error('Resume upload error:', error.message);
    res.status(500).json({ error: 'Failed to process resume. Please try again.' });
  }
});

// Job tracker
router.get('/tracker', verifyToken, async (req, res) => {
  console.log('Job tracker request:', { userId: req.userId });
  try {
    const jobs = await Job.find({ userId: req.userId });
    res.json(jobs);
  } catch (error) {
    console.error('Job tracker error:', error.message);
    res.status(500).json({ error: 'Failed to load job applications. Please try again.' });
  }
});

module.exports = router;