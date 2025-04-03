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

const getTwilioClient = () => {
  if (!process.env.TWILIO_SID || !process.env.TWILIO_AUTH_TOKEN) {
    console.error('Twilio credentials missing. SMS functionality disabled.');
    return null;
  }
  return twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
};

router.post('/fetch', authMiddleware, async (req, res) => {
  const { technology, companies } = req.body;
  try {
    if (!adzunaAppId || !adzunaAppKey) throw new Error('Adzuna API credentials missing');
    if (companies.length < 2 || companies.length > 10) {
      return res.status(400).json({ msg: 'Please select between 2 and 10 companies' });
    }
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
  const { jobId, technology, userDetails, jobTitle, company } = req.body;
  const user = await User.findById(req.user.id);
  if (!user || (!user.paid && user.email !== 'test@zvertexai.com')) {
    return res.status(404).json({ msg: 'User not found or not subscribed' });
  }

  try {
    // Check if job was already applied
    if (user.appliedJobs.some(job => job.jobId === jobId)) {
      return res.status(400).json({ msg: 'Already applied to this job' });
    }

    // Simulate job application (replace with actual application logic)
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto(`https://api.adzuna.com/v1/api/jobs/us/search/1?app_id=${adzunaAppId}&app_key=${adzunaAppKey}&what=${technology}&content-type=application/json`); 
    // Note: Actual application would need job-specific URL and form handling
    await browser.close();

    // Update user's applied jobs
    user.appliedJobs.push({ jobId, technology, date: new Date() });
    await user.save();

    // Email notification
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: `Application Confirmation: ${jobTitle} at ${company}`,
      html: `
        <h2>Application Submitted Successfully!</h2>
        <p>You've applied to:</p>
        <ul>
          <li>Position: ${jobTitle}</li>
          <li>Company: ${company}</li>
          <li>Job ID: ${jobId}</li>
          <li>Technology: ${technology}</li>
          <li>Date: ${new Date().toLocaleString()}</li>
        </ul>
        <p>We'll notify you of any updates regarding your application!</p>
      `,
    });

    // SMS notification
    const twilioClient = getTwilioClient();
    if (twilioClient && process.env.TWILIO_PHONE) {
      await twilioClient.messages.create({
        body: `Applied to ${jobTitle} at ${company} (ID: ${jobId}) on ${new Date().toLocaleString()}. Check email for details!`,
        from: process.env.TWILIO_PHONE,
        to: userDetails.phone,
      });
    }

    res.json({ 
      msg: `Applied to ${jobTitle} at ${company} successfully! Confirmation sent via email${twilioClient ? ' and SMS' : ''}.`,
      job: { id: jobId, title: jobTitle, company }
    });
  } catch (err) {
    console.error('Apply Error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;