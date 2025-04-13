const express = require('express');
const router = express.Router();
const axios = require('axios');
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');
const JobApplication = require('../models/JobApplication');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Logging function
const log = (message, data = {}) => {
  console.log(`${new Date().toISOString()} - ${message}`, JSON.stringify(data, null, 2));
};

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Real-time Job Fetching (Mocked for now, replace with real API)
const fetchJobsFromAPI = async (technology, companies) => {
  // Simulated real-time job data with unique IDs
  const mockJobs = [
    { id: `job_${Date.now()}_1`, title: 'Software Engineer', company: 'Google', link: 'https://careers.google.com', technologies: ['JavaScript', 'Python'], posted: new Date() },
    { id: `job_${Date.now()}_2`, title: 'Data Scientist', company: 'Amazon', link: 'https://amazon.jobs', technologies: ['Python', 'R'], posted: new Date() },
    { id: `job_${Date.now()}_3`, title: 'DevOps Engineer', company: 'Microsoft', link: 'https://careers.microsoft.com', technologies: ['AWS', 'Docker'], posted: new Date() },
    { id: `job_${Date.now()}_4`, title: 'Frontend Developer', company: 'Facebook', link: 'https://facebook.careers', technologies: ['React', 'TypeScript'], posted: new Date() },
  ];

  return mockJobs.filter(job =>
    job.technologies.includes(technology) &&
    (companies.length === 0 || companies.includes(job.company))
  );
};

// Fetch Jobs
router.post('/fetch', authMiddleware, async (req, res) => {
  const { technology, companies } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      log('Job fetch: User not found', { userId: req.user.id });
      return res.status(404).json({ msg: 'User not found' });
    }

    if (user.subscriptionStatus === 'EXPIRED') {
      log('Job fetch: Subscription expired', { email: user.email });
      return res.status(403).json({ msg: 'Subscription expired. Please subscribe to continue.' });
    }

    const jobs = await fetchJobsFromAPI(technology, companies);
    log('Jobs fetched', { email: user.email, technology, jobCount: jobs.length });

    res.json({ jobs });
  } catch (err) {
    log('Job fetch error', { error: err.message });
    res.status(500).json({ msg: 'Server error' });
  }
});

// Apply to Job
router.post('/apply', authMiddleware, async (req, res) => {
  const { jobId, jobTitle, company, jobLink, technology, profileId } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      log('Job apply: User not found', { userId: req.user.id });
      return res.status(404).json({ msg: 'User not found' });
    }

    if (user.subscriptionStatus === 'EXPIRED') {
      log('Job apply: Subscription expired', { email: user.email });
      return res.status(403).json({ msg: 'Subscription expired. Please subscribe to continue.' });
    }

    const profile = user.profiles.id(profileId);
    if (!profile) {
      log('Job apply: Profile not found', { profileId });
      return res.status(404).json({ msg: 'Profile not found' });
    }

    if (profile.appliedJobs.some(job => job.jobId === jobId)) {
      log('Job apply: Already applied', { email: user.email, jobId });
      return res.status(400).json({ msg: 'Already applied to this job' });
    }

    const application = new JobApplication({
      userId: user._id,
      profileId,
      jobId,
      jobTitle,
      company,
      jobLink,
      technology,
      date: new Date(),
      status: 'APPLIED',
    });

    await application.save();

    profile.appliedJobs.push({ jobId, jobTitle, company, date: new Date() });
    await user.save();

    // Send confirmation email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: `Application Submitted: ${jobTitle} at ${company}`,
      html: `
        <h3>Job Application Confirmed</h3>
        <p>You've applied to <strong>${jobTitle}</strong> at <strong>${company}</strong>.</p>
        <p>Job ID: ${jobId}</p>
        <p><a href="${jobLink}">View Job Details</a></p>
        <p>Good luck!</p>
        <p>ZvertexAI Team</p>
      `,
    });

    log('Job applied successfully', { email: user.email, jobTitle, company });
    res.json({ msg: 'Application submitted successfully' });
  } catch (err) {
    log('Job apply error', { error: err.message });
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get Application History
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      log('Application history: User not found', { userId: req.user.id });
      return res.status(404).json({ msg: 'User not found' });
    }

    const applications = await JobApplication.find({ userId: user._id }).sort({ date: -1 });
    log('Fetched application history', { email: user.email, applicationCount: applications.length });

    res.json({ applications });
  } catch (err) {
    log('Application history error', { error: err.message });
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;