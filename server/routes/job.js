const express = require('express');
const User = require('../models/User');
const Job = require('../models/Job');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const transporter = require('../utils/email');

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

router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find().populate('postedBy', 'email');
    res.json(jobs);
  } catch (err) {
    console.error('Fetch Jobs Error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/auto-apply', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.subscriptionType !== 'STUDENT') {
      return res.status(403).json({ msg: 'Only students can auto-apply' });
    }
    if (!user.resume) return res.status(400).json({ msg: 'Upload a resume first' });

    const jobs = await Job.find();
    const newApplications = jobs.map(job => ({
      jobId: `${job.company}-mock`,
      date: new Date(),
      _id: job._id
    }));

    user.appliedJobs = [...user.appliedJobs, ...newApplications];
    await user.save();

    // Send email confirmation
    const jobList = jobs.map(job => `
      <li>
        <a href="https://zvertexai.netlify.app/dashboard#job-${job._id}" style="color: #f28c38;">
          ${job.title} at ${job.company} (Job ID: ${job._id})
        </a>
      </li>
    `).join('');

    const mailOptions = {
      from: 'ZvertexAI <no-reply@zvertexai.com>',
      to: user.email,
      subject: 'ZvertexAI Auto-Apply Confirmation',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #1a2a44;">Auto-Apply Confirmation</h2>
          <p>Dear ${user.email.split('@')[0]},</p>
          <p>We’re excited to confirm that you’ve successfully auto-applied to ${jobs.length} job(s) using ZvertexAI! Below is the list of jobs you’ve applied to:</p>
          <ul style="list-style-type: none; padding: 0;">
            ${jobList}
          </ul>
          <p>Click on any job link above to view details in your dashboard. We wish you the best of luck in your job search!</p>
          <p>Best regards,<br>The ZvertexAI Team</p>
          <footer style="font-size: 12px; color: #666; margin-top: 20px;">
            <p>© 2025 ZvertexAI. All rights reserved.</p>
          </footer>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Auto-apply email sent to:', user.email);

    res.json({ msg: 'Auto-applied to all jobs', appliedCount: jobs.length });
  } catch (err) {
    console.error('Auto-Apply Error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

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