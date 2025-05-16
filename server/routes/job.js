const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const nodemailer = require('nodemailer');
const axios = require('axios');
const JobApplication = require('../models/JobApplication');
const User = require('../models/User');
require('dotenv').config();

router.post('/fetch', auth, async (req, res) => {
  const { technology, companies } = req.body;

  try {
    // Fetch real-time jobs from Indeed API
    const response = await axios.get('https://api.indeed.com/ads/apisearch', {
      params: {
        publisher: process.env.INDEED_API_KEY,
        q: technology,
        l: 'remote', // Can be customized
        v: 2,
        limit: 10,
        co: 'us', // Can be customized
      },
    });

    const jobs = response.data.results.map(job => ({
      id: job.jobkey,
      title: job.jobtitle,
      company: job.company,
      link: job.url,
      technologies: [technology], // Simplified; can parse job.description
    }));

    res.json({ jobs });
  } catch (err) {
    console.error('Job fetch error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/apply', auth, async (req, res) => {
  const { jobId, jobTitle, company, jobLink, technology, profileId } = req.body;

  try {
    const user = await User.findById(req.user.id);
    const profile = user.profiles.find(p => p._id.toString() === profileId);

    const application = new JobApplication({
      user: req.user.id,
      jobId,
      jobTitle,
      company,
      jobLink,
      technology,
      profileId,
    });

    await application.save();

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: `Application Submitted: ${jobTitle}`,
      text: `You have successfully applied for ${jobTitle} at ${company}.\n
        Job ID: ${jobId}\n
        Link: ${jobLink}\n
        Technology: ${technology}\n
        We will notify you of any updates.`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ msg: 'Application submitted' });
  } catch (err) {
    console.error('Job apply error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/history', auth, async (req, res) => {
  try {
    const applications = await JobApplication.find({ user: req.user.id });
    res.json({ applications });
  } catch (err) {
    console.error('Job history error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;