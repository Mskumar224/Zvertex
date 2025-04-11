const express = require('express');
const router = express.Router();
const axios = require('axios');
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');
const nodemailer = require('nodemailer');

router.post('/fetch', async (req, res) => {
  const { technology, location } = req.body;

  try {
    // Mock job fetch (replace with Adzuna API if configured)
    const jobs = [
      {
        id: '1',
        title: `${technology || 'Software'} Engineer`,
        company: 'Tech Corp',
        location: location || 'Remote',
        description: `Join our team to build ${technology || 'innovative'} solutions.`,
      },
      {
        id: '2',
        title: `${technology || 'Data'} Scientist`,
        company: 'Data Inc',
        location: location || 'Austin, TX',
        description: `Analyze data with ${technology || 'advanced'} tools.`,
      },
    ];

    res.json({ jobs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/:jobId', async (req, res) => {
  const { jobId } = req.params;
  try {
    // Mock job fetch by ID
    const job = {
      id: jobId,
      title: 'Sample Job',
      company: 'Sample Corp',
      location: 'Sample Location',
      description: 'This is a sample job description.',
    };
    res.json({ job });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/applied', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json({ jobs: user.appliedJobs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/apply', authMiddleware, async (req, res) => {
  let body = {};
  if (req.is('multipart/form-data')) {
    body = req.body;
    body.resume = req.files?.resume;
  } else {
    body = req.body;
  }
  const { jobId, technology, jobTitle, company } = body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user.appliedJobs.push({ jobId, technology, jobTitle, company, date: new Date() });
    if (body.resume) {
      user.resume = `/uploads/resumes/${jobId}-${Date.now()}-${body.resume.name}`;
      // In production, save the file to a storage service
    }
    await user.save();

    // Send email confirmation
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: '"ZvertexAI" <no-reply@zvertexai.com>',
      to: user.email,
      subject: `Application Submitted: ${jobTitle} at ${company}`,
      html: `
        <h2>Application Confirmation</h2>
        <p>Dear ${user.email},</p>
        <p>Thank you for applying to <strong>${jobTitle}</strong> at <strong>${company}</strong>.</p>
        <p>Your application is being processed in association with <strong>Hono Technology</strong>.</p>
        <p>We’ll notify you of any updates. For inquiries, contact us at support@zvertexai.com.</p>
        <p>Best regards,<br/>ZvertexAI Team</p>
      `,
    });

    res.json({ msg: 'Job application submitted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;