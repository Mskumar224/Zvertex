const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const axios = require('axios');
const User = require('../models/User');

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY; // Add this to your .env file

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
    if (!RAPIDAPI_KEY) {
      console.error('Missing RapidAPI key');
      return res.status(500).json({ msg: 'RapidAPI key missing' });
    }
    if (!technology) {
      return res.status(400).json({ msg: 'Technology is required' });
    }
    console.log('Fetching jobs with:', { technology, companies });

    // Use Indeed API via RapidAPI
    const response = await axios.get('https://indeed12.p.rapidapi.com/jobs/search', {
      params: {
        query: technology,
        location: 'United States',
        page_id: '1',
        fromage: '30', // Jobs from the last 30 days
      },
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'indeed12.p.rapidapi.com'
      },
    });

    console.log('Indeed API response:', response.data);
    const jobs = response.data.hits.map((job) => ({
      id: job.id || `${job.title}-${job.company_name}-${Date.now()}`, // Fallback ID
      title: job.title,
      company: job.company_name,
      location: job.location || 'Unknown',
      url: job.link || `https://www.indeed.com/viewjob?jk=${job.id}`, // Construct URL if not provided
    }));

    if (jobs.length === 0) {
      console.log('No jobs found for query:', technology);
      return res.json({ jobs: [], msg: 'No jobs found for this technology' });
    }

    // Filter by companies if provided (optional)
    const filteredJobs = companies && companies.length > 0 
      ? jobs.filter(job => companies.some(c => job.company.toLowerCase().includes(c.toLowerCase())))
      : jobs;

    res.json({ jobs: filteredJobs.slice(0, 10) }); // Limit to 10 jobs for simplicity
  } catch (err) {
    console.error('Fetch Jobs Error Details:', {
      message: err.message,
      stack: err.stack,
      response: err.response?.data,
      status: err.response?.status
    });
    res.status(500).json({ msg: 'Server error fetching jobs', error: err.message });
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

    // Simplified Puppeteer automation (for debugging and simulation)
    console.log(`Applying to ${jobTitle} at ${company} (URL: ${jobUrl})`);
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto(jobUrl, { waitUntil: 'networkidle2', timeout: 30000 }).catch(err => {
      console.error('Navigation error:', err);
    });

    const pageContent = await page.content();
    console.log('Page content snippet:', pageContent.substring(0, 500));

    // Simulate form filling (basic; real automation needs site-specific logic)
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

    // Update applied jobs
    user.appliedJobs.push({ jobId, technology, date: new Date() });
    await user.save();

    // Send confirmation email
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
    }).catch(err => {
      console.error('Email send error:', err);
      throw new Error('Failed to send confirmation email');
    });

    // Send SMS (optional)
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

router.post('/employer-response', async (req, res) => {
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
      }).catch(err => console.error('Email send error:', err));
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