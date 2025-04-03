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
    if (!adzunaAppId || !adzunaAppKey) {
      console.error('Missing Adzuna credentials');
      return res.status(500).json({ msg: 'Adzuna API credentials missing' });
    }
    if (!Array.isArray(companies) || companies.length < 2 || companies.length > 10) {
      console.error('Invalid companies array:', companies);
      return res.status(400).json({ msg: 'Please select between 2 and 10 companies' });
    }
    console.log('Fetching jobs with:', { technology, companies });

    const searchQuery = `${technology} ${companies.join(' ')}`;
    const response = await axios.get('https://api.adzuna.com/v1/api/jobs/us/search/1', {
      params: {
        app_id: adzunaAppId,
        app_key: adzunaAppKey,
        what: searchQuery,
        where: 'USA',
        results_per_page: 10,
      },
    });
    console.log('Adzuna response:', response.data);
    const jobs = response.data.results.map((job) => ({
      id: job.id,
      title: job.title,
      company: job.company.display_name,
      location: job.location.display_name,
      url: job.redirect_url,
    }));
    res.json({ jobs });
  } catch (err) {
    console.error('Fetch Jobs Error Details:', {
      message: err.message,
      stack: err.stack,
      response: err.response?.data,
      status: err.response?.status
    });
    if (err.response?.status === 400) {
      return res.status(400).json({ 
        msg: 'Invalid job search parameters', 
        error: err.response.data || err.message 
      });
    }
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

router.post('/apply', authMiddleware, async (req, res) => {
  const { jobId, technology, userDetails, jobTitle, company, jobUrl } = req.body;
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ msg: 'User not found' });
  }

  try {
    if (user.appliedJobs.some(job => job.jobId === jobId)) {
      return res.status(400).json({ msg: 'Already applied to this job' });
    }

    // Check for required details
    const requiredFields = ['phone', 'email', 'fullName', 'address'];
    const missingFields = requiredFields.filter(field => !userDetails[field]);
    if (missingFields.length > 0) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      });
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Complete Your Profile to Apply for Jobs',
        html: `
          <h2>Missing Information</h2>
          <p>To auto-apply for jobs, please update your profile with the following details:</p>
          <ul>${missingFields.map(field => `<li>${field}</li>`).join('')}</ul>
          <p>Visit your dashboard to update: <a href="https://zvertexai.com/dashboard">Dashboard</a></p>
        `,
      });
      return res.status(400).json({ msg: `Missing required details: ${missingFields.join(', ')}. Check your email for instructions.` });
    }

    // Auto-fill and apply using Puppeteer
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto(jobUrl, { waitUntil: 'networkidle2' });

    // Auto-fill common form fields (example logic; adjust based on actual job site forms)
    await page.evaluate((details) => {
      const fields = {
        'input[name="email"], input[type="email"]': details.email,
        'input[name="phone"], input[type="tel"]': details.phone,
        'input[name="name"], input[name="fullName"]': details.fullName,
        'input[name="address"], textarea[name="address"]': details.address,
      };
      for (const [selector, value] of Object.entries(fields)) {
        const element = document.querySelector(selector);
        if (element) element.value = value;
      }
      const resumeInput = document.querySelector('input[type="file"]');
      if (resumeInput) resumeInput.setAttribute('data-file', 'resume.pdf'); // Placeholder; actual file upload needs server-side handling
      const submitButton = document.querySelector('button[type="submit"], input[type="submit"]');
      if (submitButton) submitButton.click();
    }, userDetails);

    await page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => console.log('Navigation timeout'));
    await browser.close();

    // Update applied jobs
    user.appliedJobs.push({ jobId, technology, date: new Date() });
    await user.save();

    // Send confirmation to user
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: `Application Submitted: ${jobTitle} at ${company}`,
      html: `
        <h2>Application Submitted Successfully!</h2>
        <p>You've applied to:</p>
        <ul>
          <li>Position: ${jobTitle}</li>
          <li>Company: ${company}</li>
          <li>Job ID: ${jobId}</li>
          <li>Technology: ${technology}</li>
          <li>Date: ${new Date().toLocaleString()}</li>
          <li>Link: <a href="${jobUrl}">${jobUrl}</a></li>
        </ul>
        <p>We’ll forward any employer responses to this email and your phone (${userDetails.phone}).</p>
      `,
    });

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

// New endpoint to handle employer responses (simulated for now)
router.post('/employer-response', async (req, res) => {
  const { jobId, userEmail, message } = req.body;
  try {
    const user = await User.findOne({ email: userEmail });
    if (!user || !user.appliedJobs.some(job => job.jobId === jobId)) {
      return res.status(404).json({ msg: 'Job or user not found' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: `Update on Your Application: ${jobId}`,
      html: `
        <h2>Employer Response</h2>
        <p>Regarding your application (Job ID: ${jobId}):</p>
        <p>${message}</p>
        <p>Reply directly to this email or contact the employer as instructed.</p>
      `,
    });

    const twilioClient = getTwilioClient();
    if (twilioClient && process.env.TWILIO_PHONE && user.phone) {
      await twilioClient.messages.create({
        body: `Update on Job ${jobId}: ${message.substring(0, 100)}... Check email for full details!`,
        from: process.env.TWILIO_PHONE,
        to: user.phone,
      });
    }

    res.json({ msg: 'Employer response forwarded to user' });
  } catch (err) {
    console.error('Employer Response Error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;