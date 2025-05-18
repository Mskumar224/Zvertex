const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Job = require('../models/Job');
const { parseResume } = require('../utils/resumeParser');
const { sendEmail } = require('../utils/email');
const axios = require('axios');
const jwt = require('jsonwebtoken');

router.post('/upload-resume', async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);

  if (!user.isVerified) return res.status(400).json({ error: 'Account not verified' });
  if (user.resumesUploaded >= user.resumes) {
    return res.status(400).json({ error: 'Resume upload limit reached' });
  }

  const resume = req.files.resume;
  const keywords = await parseResume(resume);
  user.resumesUploaded += 1;
  await user.save();
  res.json({ keywords });
});

router.post('/detect-company', async (req, res) => {
  const { company } = req.body;
  try {
    const response = await axios.get(`https://api.duckduckgo.com/?q=${company}&format=json`);
    const valid = response.data.Heading.toLowerCase().includes(company.toLowerCase());
    res.json({ valid, company });
  } catch (error) {
    res.status(400).json({ error: 'Detection failed' });
  }
});

router.post('/save-preferences', async (req, res) => {
  const { preferences } = req.body;
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);

  if (!user.isVerified) return res.status(400).json({ error: 'Account not verified' });
  
  user.preferences = preferences;
  await user.save();
  res.json({ message: 'Preferences saved' });
});

router.post('/fetch-jobs', async (req, res) => {
  const { company, keywords } = req.body;
  // Mock job fetch (replace with real API like Indeed or LinkedIn)
  const jobs = [
    { id: '1', title: `${keywords[0]} Engineer`, company, link: `http://example.com/${company}/job1`, requiresDocs: false },
    { id: '2', title: `${keywords[0]} Analyst`, company, link: `http://example.com/${company}/job2`, requiresDocs: true },
  ];
  res.json({ jobs });
});

router.post('/apply', async (req, res) => {
  const { jobId } = req.body;
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);

  if (!user.isVerified) return res.status(400).json({ error: 'Account not verified' });
  if (user.submissionsToday >= user.submissions) {
    return res.status(400).json({ error: 'Daily submission limit reached' });
  }

  let job = await Job.findOne({ jobId, user: user._id });
  if (!job) {
    job = new Job({ 
      jobId, 
      title: `Job ${jobId}`, 
      company: 'Detected Company', 
      link: `http://example.com/job${jobId}`, 
      applied: true, 
      user: user._id, 
      requiresDocs: false 
    });
    await job.save();
    user.jobsApplied.push(job._id);
    user.submissionsToday += 1;
    await user.save();
    await sendEmail(user.email, 'Job Application Confirmation', `Applied to Job ID: ${jobId} at ${job.company}. Check status: ${job.link}`);
  }
  res.json({ message: 'Applied', job });
});

router.post('/apply-with-docs', async (req, res) => {
  const { jobId } = req.body;
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);

  if (!user.isVerified) return res.status(400).json({ error: 'Account not verified' });
  if (user.submissionsToday >= user.submissions) {
    return res.status(400).json({ error: 'Daily submission limit reached' });
  }

  const job = new Job({ 
    jobId, 
    title: `Job ${jobId}`, 
    company: 'Detected Company', 
    link: `http://example.com/job${jobId}`, 
    applied: true, 
    user: user._id, 
    requiresDocs: true 
  });
  await job.save();
  user.jobsApplied.push(job._id);
  user.submissionsToday += 1;
  await user.save();
  await sendEmail(user.email, 'Job Application Confirmation with Documents', `Applied to Job ID: ${jobId} with documents at ${job.company}. Check status: ${job.link}`);
  res.json({ message: 'Applied with documents' });
});

router.get('/tracker', async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const jobs = await Job.find({ user: decoded.id });
  res.json(jobs);
});

module.exports = router;