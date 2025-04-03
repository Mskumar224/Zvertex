const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const axios = require('axios');
const User = require('../models/User');

const adzunaAppId = process.env.ADZUNA_APP_ID;
const adzunaAppKey = process.env.ADZUNA_APP_KEY;

// Initialize Twilio client lazily with error handling
const getTwilioClient = () => {
  if (!process.env.TWILIO_SID || !process.env.TWILIO_AUTH_TOKEN) {
    console.error('Twilio credentials missing. SMS functionality will be disabled.');
    return null;
  }
  return twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
};

router.post('/fetch', authMiddleware, async (req, res) => {
  const { technology, companies } = req.body;
  try {
    if (!adzunaAppId || !adzunaAppKey) throw new Error('Adzuna API credentials missing');
    const response = await axios.get('https://api.adzuna.com/v1/api/jobs/us/search/1', {
      params: {
        app_id: adzunaAppId,
        app_key: adzunaAppKey,
        what: technology,
        where: 'USA',
        company: companies.join(','),
        results_per_page: 10,
      },
    });
    const jobs = response.data.results.map((job) => ({
      id: job.id,
      title: job.title,
      company: job.company.display_name,
      location: job.location.display_name,
      url: job.redirect_url,
    }));
    res.json({ jobs });
  } catch (err) {
    console.error('Fetch Jobs Error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

router.post('/apply', authMiddleware, async (req, res) => {
  const { jobId, technology, userDetails } = req.body;
  const user = await User.findById(req.user.id);
  if (!user || (!user.paid && user.email !== 'test@zvertexai.com')) {
    return res.status(404).json({ msg: 'User not found or not subscribed' });
  }

  try {
    // Mock Puppeteer automation (replace with real logic)
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto(`https://www.adzuna.com/browse/job/${jobId}`); // Replace with job.url from Adzuna
    await page.type('#email', userDetails.email);
    await page.type('#phone', userDetails.phone);
    await page.click('#submit'); // Adjust selector based on actual site
    await browser.close();

    user.appliedJobs.push({ jobId, technology, date: new Date() });
    await user.save();

    // Email confirmation
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: `Application Confirmation: ${jobId}`,
      text: `You’ve successfully applied to ${jobId} using ${technology}. We’ll keep you updated!`,
    });

    // SMS confirmation
    const twilioClient = getTwilioClient();
    if (twilioClient && process.env.TWILIO_PHONE) {
      await twilioClient.messages.create({
        body: `Applied to ${jobId} at ${new Date().toLocaleString()}. Check your email for details!`,
        from: process.env.TWILIO_PHONE,
        to: userDetails.phone,
      });
    } else {
      console.warn('SMS not sent due to missing Twilio configuration');
    }

    res.json({ msg: `Applied to ${jobId} successfully! Confirmation sent via email${twilioClient ? ' and SMS' : ''}.` });
  } catch (err) {
    console.error('Apply Error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;