const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

const JWT_SECRET = process.env.JWT_SECRET;

router.post('/upload', async (req, res) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (!req.files || !req.files.resume) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const resume = req.files.resume;
    if (!['application/pdf'].includes(resume.mimetype)) {
      return res.status(400).json({ message: 'Only PDF files are allowed' });
    }

    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = `${user._id}_${Date.now()}.pdf`;
    const filePath = path.join(uploadDir, fileName);
    await resume.mv(filePath);

    user.resumes = (user.resumes || 0) + 1;
    await user.save();

    res.json({ message: 'File uploaded successfully', filePath });
  } catch (error) {
    console.error('Upload error:', error.message);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

router.post('/create', async (req, res) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { title, description, company, location } = req.body;
    if (!title || !description || !company || !location) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const job = new Job({
      title,
      description,
      company,
      location,
      postedBy: user._id,
    });
    await job.save();

    res.status(201).json({ message: 'Job created successfully', job });
  } catch (error) {
    console.error('Job creation error:', error.message);
    res.status(500).json({ message: 'Job creation failed', error: error.message });
  }
});

router.get('/all', async (req, res) => {
  try {
    const jobs = await Job.find().populate('postedBy', 'name email');
    res.json(jobs);
  } catch (error) {
    console.error('Fetch jobs error:', error.message);
    res.status(500).json({ message: 'Failed to fetch jobs', error: error.message });
  }
});

module.exports = router;