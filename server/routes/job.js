const express = require('express');
const User = require('../models/User');
const Job = require('../models/Job');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// Post a job
router.post('/post', authMiddleware, async (req, res) => {
  const { title, company, location, description } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (user.subscriptionType === 'STUDENT') {
      return res.status(403).json({ msg: 'Students cannot post jobs' });
    }

    const job = new Job({ title, company, location, description, postedBy: req.user.id });
    await job.save();
    res.json(job);
  } catch (err) {
    console.error('Post Job Error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Fetch all jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find().populate('postedBy', 'email');
    res.json(jobs);
  } catch (err) {
    console.error('Fetch Jobs Error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Auto-apply
router.post('/auto-apply', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.subscriptionType !== 'STUDENT') {
      return res.status(403).json({ msg: 'Only students can auto-apply' });
    }
    if (!user.resume) return res.status(400).json({ msg: 'Upload a resume first' });

    const jobs = await Job.find();
    const newApplications = jobs.map(job => ({
      jobId: `${job.company}-mock`, // Example identifier; adjust as needed
      date: new Date(),
      _id: job._id // Store the Job's ObjectId
    }));

    user.appliedJobs = [...user.appliedJobs, ...newApplications];
    await user.save();
    res.json({ msg: 'Auto-applied to all jobs', appliedCount: jobs.length });
  } catch (err) {
    console.error('Auto-Apply Error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Get applied jobs
router.get('/applied', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('appliedJobs._id', 'title company location');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user.appliedJobs);
  } catch (err) {
    console.error('Fetch Applied Jobs Error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;