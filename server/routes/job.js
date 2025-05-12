const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Job = require('../models/Job');
const jwt = require('jsonwebtoken');
const { parseResume } = require('../utils/resumeParser');
const { v4: uuidv4 } = require('uuid'); // Added for unique jobId generation

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

router.post('/upload-resume', async (req, res) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (!req.files || !req.files.resume) return res.status(400).json({ error: 'No resume file uploaded' });

    const resume = req.files.resume;
    const keywords = await parseResume(resume);
    res.json({ keywords });
  } catch (error) {
    console.error('Resume Upload Error:', error.message);
    res.status(500).json({ error: 'Failed to upload resume' });
  }
});

router.get('/tracker', async (req, res) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).populate('jobsApplied');
    if (!user) return res.status(404).json({ error: 'User not found' });
    const jobs = user.jobsApplied || [];
    res.json(jobs);
  } catch (error) {
    console.error('Job Tracker Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch job tracker data' });
  }
});

router.post('/fetch-jobs', async (req, res) => {
  const { company, keywords, jobType, locationZip, jobPosition } = req.body;
  // Mock jobs based on preferences
  const mockJobs = [
    {
      id: uuidv4(),
      title: `${jobPosition || 'Software Engineer'} - ${jobType || 'Full Time'}`,
      company: company || 'Tech Corp',
      link: `https://${(company || 'techcorp').toLowerCase()}.com/jobs/1`,
      applied: false,
      location: locationZip ? `Near ${locationZip}` : 'Remote',
    },
    {
      id: uuidv4(),
      title: `${jobPosition || 'Backend Developer'} - ${jobType || 'Contract'}`,
      company: company || 'Innovate Inc',
      link: `https://${(company || 'innovate').toLowerCase()}.com/jobs/2`,
      applied: false,
      location: locationZip ? `Near ${locationZip}` : 'Hybrid',
    },
  ];
  res.json({ jobs: mockJobs });
});

router.post('/apply', async (req, res) => {
  let { jobId } = req.body;
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Generate a unique jobId if none is provided
    if (!jobId) {
      jobId = uuidv4();
    }

    const job = new Job({
      jobId,
      title: req.body.title || `Job ${jobId}`,
      company: req.body.company || 'Detected Company',
      link: req.body.link || `https://example.com/job${jobId}`,
      applied: true,
      user: user._id,
    });
    await job.save();
    user.jobsApplied.push(job._id);
    await user.save();
    res.json({ message: `Applied to job ${jobId}`, job });
  } catch (error) {
    console.error('Job Apply Error:', error.message);
    res.status(500).json({ error: 'Failed to apply to job', details: error.message });
  }
});

module.exports = router;