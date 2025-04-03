const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const axios = require('axios');

router.post('/fetch', authMiddleware, async (req, res) => {
  const { technology, companies } = req.body;
  try {
    // Mock job fetching (replace with real API like Indeed or Adzuna)
    const jobs = companies.map((company, index) => ({
      id: `${company}-${index}`,
      title: `${technology} Developer`,
      company,
      url: `https://example.com/job/${company}-${technology}`, // Placeholder
    }));
    res.json({ jobs });
  } catch (err) {
    console.error('Fetch Jobs Error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

router.post('/apply', authMiddleware, async (req, res) => {
  const { jobId, technology } = req.body;
  const user = await User.findById(req.user.id);
  if (!user || (!user.paid && user.email !== 'test@zvertexai.com')) {
    return res.status(404).json({ msg: 'User not found or not subscribed' });
  }

  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    // Mock job application (replace with real URL and form logic)
    await page.goto(`https://example.com/job/${jobId}`);
    await page.type('#email', user.email);
    await page.type('#phone', user.phone || '123-456-7890'); // Default if not set
    await page.click('#submit');
    await browser.close();

    user.appliedJobs.push({ jobId, technology, date: new Date() });
    await user.save();

    // Email communication
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: `Applied to ${jobId}`,
      text: `You’ve applied to ${jobId} using ${technology}. We’ll notify you of updates!`,
    });

    res.json({ msg: `Applied to ${jobId} successfully!` });
  } catch (err) {
    console.error('Apply Error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;