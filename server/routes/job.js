const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Job = require('../models/Job');
const { parseResume } = require('../utils/resumeParser');
const { sendEmail } = require('../utils/email');
const axios = require('axios');
const jwt = require('jsonwebtoken');

router.get('/user', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({
      email: user.email,
      phone: user.phone,
      subscription: user.subscription,
      preferences: user.preferences,
      resumes: user.resumes,
      submissions: user.submissions
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Failed to fetch user data', error: error.message });
  }
});

router.post('/upload-resume', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user.isVerified) return res.status(400).json({ error: 'Account not verified' });
    if (user.resumesUploaded >= user.resumes) {
      return res.status(400).json({ error: 'Resume upload limit reached' });
    }

    const resume = req.files.resume;
    const keywords = await parseResume(resume);
    user.resumesUploaded += 1;
    await user.save();

    const emailTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f5f5f5; padding: 20px;">
        <div style="background-color: #1a2a44; padding: 10px; text-align: center;">
          <h1 style="color: white; margin: 0;">ZvertexAI</h1>
        </div>
        <div style="background-color: white; padding: 20px; border-radius: 5px; margin-top: 10px;">
          <h2 style="color: #1a2a44;">Resume Upload Confirmation</h2>
          <p>Dear ${user.email},</p>
          <p>You have successfully uploaded a resume. Extracted keywords: ${keywords.join(', ')}.</p>
          <p>These will be used for job matching and auto-apply processes.</p>
          <p>Best regards,<br>ZvertexAI Team</p>
        </div>
        <div style="text-align: center; color: #757575; margin-top: 10px;">
          <p>© 2025 ZvertexAI. All rights reserved.</p>
        </div>
      </div>
    `;
    await sendEmail(user.email, 'ZvertexAI Resume Upload Confirmation', emailTemplate);

    res.json({ keywords });
  } catch (error) {
    console.error('Resume upload error:', error);
    res.status(500).json({ error: 'Resume upload failed' });
  }
});

router.post('/detect-company', async (req, res) => {
  const { company } = req.body;
  try {
    const response = await axios.get(`https://api.duckduckgo.com/?q=${company}&format=json`);
    const valid = response.data.Heading.toLowerCase().includes(company.toLowerCase());
    res.json({ valid, company });
  } catch (error) {
    console.error('Company detection error:', error);
    res.status(400).json({ error: 'Detection failed' });
  }
});

router.post('/save-preferences', async (req, res) => {
  const { preferences } = req.body;
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user.isVerified) return res.status(400).json({ error: 'Account not verified' });

    user.preferences = preferences;
    await user.save();

    const emailTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f5f5f5; padding: 20px;">
        <div style="background-color: #1a2a44; padding: 10px; text-align: center;">
          <h1 style="color: white; margin: 0;">ZvertexAI</h1>
        </div>
        <div style="background-color: white; padding: 20px; border-radius: 5px; margin-top: 10px;">
          <h2 style="color: #1a2a44;">Preferences Saved</h2>
          <p>Dear ${user.email},</p>
          <p>Your job preferences have been successfully saved.</p>
          <p>Best regards,<br>ZvertexAI Team</p>
        </div>
        <div style="text-align: center; color: #757575; margin-top: 10px;">
          <p>© 2025 ZvertexAI. All rights reserved.</p>
        </div>
      </div>
    `;
    await sendEmail(user.email, 'ZvertexAI Preferences Saved', emailTemplate);

    res.json({ message: 'Preferences saved successfully' });
  } catch (error) {
    console.error('Save preferences error:', error);
    res.status(500).json({ error: 'Failed to save preferences' });
  }
});

router.post('/fetch-jobs', async (req, res) => {
  const { company, keywords } = req.body;
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user.isVerified) return res.status(400).json({ error: 'Account not verified' });

    // Mock job fetching logic (replace with actual job scraping or API call)
    const jobs = [
      {
        id: `job-${Date.now()}-${Math.random()}`,
        title: `Software Engineer at ${company}`,
        company,
        link: `https://${company.toLowerCase()}.com/careers`,
        applied: false,
        requiresDocs: Math.random() > 0.7 // 30% chance to require documents
      },
      {
        id: `job-${Date.now()}-${Math.random()}`,
        title: `Data Scientist at ${company}`,
        company,
        link: `https://${company.toLowerCase()}.com/careers`,
        applied: false,
        requiresDocs: Math.random() > 0.7
      }
    ];

    res.json({ jobs });
  } catch (error) {
    console.error('Fetch jobs error:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

router.post('/apply', async (req, res) => {
  const { jobId, company, link } = req.body;
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user.isVerified) return res.status(400).json({ error: 'Account not verified' });
    if (user.submissionsToday >= user.submissions) {
      return res.status(400).json({ error: 'Daily submission limit reached' });
    }

    const existingJob = await Job.findOne({ jobId, user: user._id });
    if (existingJob) {
      return res.status(400).json({ error: 'Job already applied' });
    }

    const job = new Job({
      jobId,
      title: `Job at ${company}`,
      company,
      link,
      user: user._id,
      applied: true
    });
    await job.save();

    user.jobsApplied.push(job._id);
    user.submissionsToday += 1;
    await user.save();

    // Send confirmation email to user
    const userEmailTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f5f5f5; padding: 20px;">
        <div style="background-color: #1a2a44; padding: 10px; text-align: center;">
          <h1 style="color: white; margin: 0;">ZvertexAI</h1>
        </div>
        <div style="background-color: white; padding: 20px; border-radius: 5px; margin-top: 10px;">
          <h2 style="color: #1a2a44;">Job Application Confirmation</h2>
          <p>Dear ${user.email},</p>
          <p>You have successfully applied to a job at ${company}.</p>
          <p>Job Link: <a href="${link}">${link}</a></p>
          <p>Best regards,<br>ZvertexAI Team</p>
        </div>
        <div style="text-align: center; color: #757575; margin-top: 10px;">
          <p>© 2025 ZvertexAI. All rights reserved.</p>
        </div>
      </div>
    `;
    await sendEmail(user.email, 'ZvertexAI Job Application Confirmation', userEmailTemplate);

    // Send confirmation email to company
    const companyEmailTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f5f5f5; padding: 20px;">
        <div style="background-color: #1a2a44; padding: 10px; text-align: center;">
          <h1 style="color: white; margin: 0;">ZvertexAI</h1>
        </div>
        <div style="background-color: white; padding: 20px; border-radius: 5px; margin-top: 10px;">
          <h2 style="color: #1a2a44;">New Job Application</h2>
          <p>Dear ZvertexAI Team,</p>
          <p>A user (${user.email}) has applied to a job at ${company}.</p>
          <p>Job Link: <a href="${link}">${link}</a></p>
          <p>Best regards,<br>ZvertexAI System</p>
        </div>
        <div style="text-align: center; color: #757575; margin-top: 10px;">
          <p>© 2025 ZvertexAI. All rights reserved.</p>
        </div>
      </div>
    `;
    await sendEmail('zvertex.247@gmail.com', 'ZvertexAI New Job Application', companyEmailTemplate);

    res.json({ message: 'Job applied successfully' });
  } catch (error) {
    console.error('Job apply error:', error);
    res.status(500).json({ error: 'Job application failed' });
  }
});

router.post('/apply-with-docs', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user.isVerified) return res.status(400).json({ error: 'Account not verified' });
    if (user.submissionsToday >= user.submissions) {
      return res.status(400).json({ error: 'Daily submission limit reached' });
    }

    const { jobId, company, link } = req.body;
    const document = req.files.document;

    const existingJob = await Job.findOne({ jobId, user: user._id });
    if (existingJob) {
      return res.status(400).json({ error: 'Job already applied' });
    }

    const job = new Job({
      jobId,
      title: `Job at ${company}`,
      company,
      link,
      user: user._id,
      applied: true,
      requiresDocs: true
    });
    await job.save();

    user.jobsApplied.push(job._id);
    user.submissionsToday += 1;
    await user.save();

    // Send confirmation email to user
    const userEmailTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f5f5f5; padding: 20px;">
        <div style="background-color: #1a2a44; padding: 10px; text-align: center;">
          <h1 style="color: white; margin: 0;">ZvertexAI</h1>
        </div>
        <div style="background-color: white; padding: 20px; border-radius: 5px; margin-top: 10px;">
          <h2 style="color: #1a2a44;">Job Application with Documents Confirmation</h2>
          <p>Dear ${user.email},</p>
          <p>You have successfully applied to a job at ${company} with additional documents.</p>
          <p>Job Link: <a href="${link}">${link}</a></p>
          <p>Best regards,<br>ZvertexAI Team</p>
        </div>
        <div style="text-align: center; color: #757575; margin-top: 10px;">
          <p>© 2025 ZvertexAI. All rights reserved.</p>
        </div>
      </div>
    `;
    await sendEmail(user.email, 'ZvertexAI Job Application with Documents Confirmation', userEmailTemplate);

    // Send confirmation email to company
    const companyEmailTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f5f5f5; padding: 20px;">
        <div style="background-color: #1a2a44; padding: 10px; text-align: center;">
          <h1 style="color: white; margin: 0;">ZvertexAI</h1>
        </div>
        <div style="background-color: white; padding: 20px; border-radius: 5px; margin-top: 10px;">
          <h2 style="color: #1a2a44;">New Job Application with Documents</h2>
          <p>Dear ZvertexAI Team,</p>
          <p>A user (${user.email}) has applied to a job at ${company} with additional documents.</p>
          <p>Job Link: <a href="${link}">${link}</a></p>
          <p>Best regards,<br>ZvertexAI System</p>
        </div>
        <div style="text-align: center; color: #757575; margin-top: 10px;">
          <p>© 2025 ZvertexAI. All rights reserved.</p>
        </div>
      </div>
    `;
    await sendEmail('zvertex.247@gmail.com', 'ZvertexAI New Job Application with Documents', companyEmailTemplate);

    res.json({ message: 'Job applied with documents successfully' });
  } catch (error) {
    console.error('Job apply with docs error:', error);
    res.status(500).json({ error: 'Job application with documents failed' });
  }
});

router.get('/tracker', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).populate('jobsApplied');

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user.jobsApplied);
  } catch (error) {
    console.error('Job tracker error:', error);
    res.status(500).json({ error: 'Failed to fetch job tracker' });
  }
});

module.exports = router;