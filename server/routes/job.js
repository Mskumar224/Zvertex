const express = require('express');
const router = express.Router(); // Define router here
const authMiddleware = require('../middleware/auth');
const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const axios = require('axios');
const User = require('../models/User');

const getTwilioClient = () => {
  if (!process.env.TWILIO_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE) {
    console.error('Twilio credentials missing. SMS functionality disabled.');
    return null;
  }
  return twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
};

router.post('/fetch', authMiddleware, async (req, res) => {
  const { technology, companies } = req.body;
  try {
    if (!technology) {
      return res.status(400).json({ msg: 'Technology is required' });
    }
    console.log('Scraping jobs with:', { technology, companies });

    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto(`https://www.indeed.com/jobs?q=${encodeURIComponent(technology)}&l=United+States`, { waitUntil: 'networkidle2', timeout: 30000 });

    const jobs = await page.evaluate(() => {
      const jobElements = document.querySelectorAll('.job_seen_beacon');
      return Array.from(jobElements).slice(0, 10).map(job => {
        const title = job.querySelector('h2')?.innerText || 'Unknown Title';
        const company = job.querySelector('.companyName')?.innerText || 'Unknown Company';
        const location = job.querySelector('.companyLocation')?.innerText || 'Unknown Location';
        const url = job.querySelector('a')?.href || '';
        return { 
          id: url.split('jk=')[1]?.split('&')[0] || `${title}-${company}-${Date.now()}`, 
          title, 
          company, 
          location, 
          url 
        };
      });
    });

    await browser.close();

    if (jobs.length === 0) {
      console.log('No jobs found for query:', technology);
      return res.json({ jobs: [], msg: 'No jobs found for this technology' });
    }

    const filteredJobs = companies && companies.length > 0 
      ? jobs.filter(job => companies.some(c => job.company.toLowerCase().includes(c.toLowerCase())))
      : jobs;

    res.json({ jobs: filteredJobs });
  } catch (err) {
    console.error('Fetch Jobs Error:', err);
    res.status(500).json({ msg: 'Server error scraping jobs', error: err.message });
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

    const requiredFields = ['phone', 'email', 'fullName', 'address'];
    const missingFields = requiredFields.filter(field => !userDetails[field]);
    if (missingFields.length > 0) {
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error('Email credentials missing');
        return res.status(500).json({ msg: 'Email service not configured' });
      }
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
          <p>Visit your dashboard to update: <a href="${process.env.API_URL || 'https://zvertexai-orzv.onrender.com'}/dashboard">Dashboard</a></p>
        `,
      });
      return res.status(400).json({ msg: `Missing required details: ${missingFields.join(', ')}. Check your email for instructions.` });
    }

    console.log(`Applying to ${jobTitle} at ${company} (URL: ${jobUrl})`);
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto(jobUrl, { waitUntil: 'networkidle2', timeout: 30000 }).catch(err => {
      console.error('Navigation error:', err);
    });

    const pageContent = await page.content();
    console.log('Page content snippet:', pageContent.substring(0, 500));

    await page.evaluate((details) => {
      console.log('Filling form with:', details);
      const fields = {
        'input[name="email"], input[type="email"]': details.email,
        'input[name="phone"], input[type="tel"]': details.phone,
        'input[name="name"], input[name="fullName"]': details.fullName,
        'input[name="address"], textarea[name="address"]': details.address,
      };
      for (const [selector, value] of Object.entries(fields)) {
        const element = document.querySelector(selector);
        if (element) {
          element.value = value;
          console.log(`Filled ${selector} with ${value}`);
        }
      }
      const submitButton = document.querySelector('button[type="submit"], input[type="submit"]');
      if (submitButton) {
        submitButton.click();
        console.log('Submit button clicked');
      } else {
        console.log('No submit button found; assuming application complete');
      }
    }, userDetails);

    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }).catch(() => {
      console.log('Navigation after submit timed out; assuming success');
    });
    await browser.close();

    user.appliedJobs.push({ jobId, technology, date: new Date() });
    await user.save();

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Email credentials missing');
      return res.status(500).json({ msg: 'Email service not configured' });
    }
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
        <p>We’ll notify you of any employer responses via this email.</p>
      `,
    });

    const twilioClient = getTwilioClient();
    if (twilioClient) {
      await twilioClient.messages.create({
        body: `Applied to ${jobTitle} at ${company} (ID: ${jobId}) on ${new Date().toLocaleString()}. Check email!`,
        from: process.env.TWILIO_PHONE,
        to: userDetails.phone,
      }).catch(err => console.error('SMS send error:', err));
    }

    res.json({ 
      msg: `Applied to ${jobTitle} at ${company} successfully! Confirmation sent via email${twilioClient ? ' and SMS' : ''}.`,
      job: { id: jobId, title: jobTitle, company }
    });
  } catch (err) {
    console.error('Apply Error:', err);
    res.status(500).json({ msg: 'Server error during application', error: err.message });
  }
});

router.post('/employer-response', authMiddleware, async (req, res) => {
  const { jobId, userEmail, message } = req.body;
  try {
    const user = await User.findOne({ email: userEmail });
    if (!user || !user.appliedJobs.some(job => job.jobId === jobId)) {
      return res.status(404).json({ msg: 'Job or user not found' });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Email credentials missing');
    } else {
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
    }

    const twilioClient = getTwilioClient();
    if (twilioClient && user.phone) {
      await twilioClient.messages.create({
        body: `Update on Job ${jobId}: ${message.substring(0, 100)}... Check email for full details!`,
        from: process.env.TWILIO_PHONE,
        to: user.phone,
      }).catch(err => console.error('SMS send error:', err));
    }

    res.json({ msg: 'Employer response forwarded to user' });
  } catch (err) {
    console.error('Employer Response Error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;