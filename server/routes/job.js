const express = require('express');
const router = express.Router();
const axios = require('axios');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

// Middleware to verify token
const auth = async (req, res, next) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    if (user.subscription === 'None' && !user.trialActive) {
      return res.status(403).json({ msg: 'Subscription required' });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error(err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Search jobs
router.get('/search', auth, async (req, res) => {
  const { query, location } = req.query;
  try {
    const response = await axios.get('https://api.adzuna.com/v1/api/jobs/us/search/1', {
      params: {
        app_id: process.env.ADZUNA_APP_ID,
        app_key: process.env.ADZUNA_APP_KEY,
        what: query || '',
        where: location || '',
        max_days_old: 7,
      },
    });
    res.json(response.data.results);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Error fetching jobs' });
  }
});

// Apply to job
router.post('/apply', auth, async (req, res) => {
  const { jobId, jobTitle, company, jobUrl } = req.body;
  try {
    // Simulate job application (replace with actual job board API)
    console.log(`User ${req.user.email} applied to ${jobTitle}`);
    // Send confirmation email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'zvertexai@honotech.com',
        pass: process.env.EMAIL_PASS,
      },
    });
    await transporter.sendMail({
      from: '"ZvertexAI" <zvertexai@honotech.com>',
      to: req.user.email,
      subject: `ZvertexAI: Application for ${jobTitle}`,
      html: `
        <p>Dear ${req.user.name},</p>
        <p>Your application for <strong>${jobTitle}</strong> at <strong>${company}</strong> has been submitted.</p>
        <p><a href="${jobUrl}">View Job</a></p>
        <p>Best wishes,</p>
        <p>ZvertexAI Team</p>
        <p><small>Contact us at zvertexai@honotech.com for support.</small></p>
      `,
    });
    res.json({ msg: 'Application submitted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Error applying to job' });
  }
});

module.exports = router;