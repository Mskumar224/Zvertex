const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Job = require('../models/Job');
const PendingAction = require('../models/PendingAction');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

// Fetch jobs (Zooma 2)
router.post('/fetch', async (req, res) => {
  try {
    const { query } = req.body;
    const jobs = await Job.find(query ? { title: { $regex: query, $options: 'i' } } : {}).limit(10);
    res.json({ jobs });
  } catch (err) {
    console.error('Zooma 2 fetch error:', err.message);
    res.status(500).json({ msg: 'Server error fetching jobs' });
  }
});

// Apply for a job
router.post('/apply', auth, async (req, res) => {
  const { jobId } = req.body;
  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(400).json({ msg: 'Job not found' });
    }
    const token = jwt.sign(
      { userId: req.user.id, action: 'job_apply', jobId },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    await new PendingAction({
      userId: req.user.id,
      action: 'job_apply',
      data: { jobId },
      token,
    }).save();
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const mailOptions = {
      from: 'zvertexai@honotech.com',
      to: req.user.email,
      subject: 'Confirm Job Application - ZvertexAI',
      html: `
        <p>Please confirm your application for ${job.title}:</p>
        <a href="${process.env.CLIENT_URL}/confirm-action/${token}">
          Confirm Application
        </a>
        <p>This link expires in 24 hours.</p>
      `,
    };
    await transporter.sendMail(mailOptions);
    res.json({ msg: 'Application pending email confirmation' });
  } catch (err) {
    console.error('Apply error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;