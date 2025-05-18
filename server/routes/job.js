const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Job = require('../models/Job');
const { parseResume } = require('../utils/resumeParser');
const { sendEmail } = require('../utils/email');
const axios = require('axios');
const jwt = require('jsonwebtoken');

router.get('/user', async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ email: user.email, phone: user.phone, subscription: user.subscription, preferences: user.preferences });
});

router.post('/upload-resume', async (req, res) => {
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
});

router.post('/detect-company', async (req, res) => {
  const { company } = req.body;
  try {
    const response = await axios.get(`https://api.duckduckgo.com/?q=${company}&format=json`);
    const valid = response.data.Heading.toLowerCase().includes(company.toLowerCase());
    res.json({ valid, company });
  } catch (error) {
    res.status(400).json({ error: 'Detection failed' });
  }
});

router.post('/save-preferences', async (req, res) => {
  const { preferences } = req.body;
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
        <h2 style="color: #1a2a44;">Preferences Updated</h2>
        <p>Dear ${user.email},</p>
        <p>Your job application preferences have been updated:</p>
        <ul>
          <li><strong>Companies:</strong> ${preferences.companies.join(', ') || 'None'}</li>
          <li><strong>Keywords:</strong> ${preferences.keywords.join(', ') || 'None'}</li>
        </ul>
        <p>These will be used for auto-apply processes.</p>
        <p>Best regards,<br>ZvertexAI Team</p>
      </div>
      <div style="text-align: center; color: #757575; margin-top: 10px;">
        <p>© 2025 ZvertexAI. All rights reserved.</p>
      </div>
    </div>
  `;
  await sendEmail(user.email, 'ZvertexAI Preferences Updated', emailTemplate);

  res.json({ message: 'Preferences saved' });
});

router.post('/fetch-jobs', async (req, res) => {
  const { company, keywords } = req.body;
  // Mock job fetch (replace with real API like Indeed or LinkedIn)
  const jobs = [
    { id: '1', title: `${keywords[0] || 'Software'} Engineer`, company, link: `https://${company.toLowerCase()}.com/careers/job1`, requiresDocs: false },
    { id: '2', title: `${keywords[0] || 'Data'} Analyst`, company, link: `https://${company.toLowerCase()}.com/careers/job2`, requiresDocs: true },
  ];
  res.json({ jobs });
});

router.post('/apply', async (req, res) => {
  const { jobId, company, link } = req.body;
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);

  if (!user.isVerified) return res.status(400).json({ error: 'Account not verified' });
  if (user.submissionsToday >= user.submissions) {
    return res.status(400).json({ error: 'Daily submission limit reached' });
  }

  let job = await Job.findOne({ jobId, user: user._id });
  if (!job) {
    job = new Job({ 
      jobId, 
      title: `Job ${jobId}`, 
      company, 
      link, 
      applied: true, 
      user: user._id, 
      requiresDocs: false 
    });
    await job.save();
    user.jobsApplied.push(job._id);
    user.submissionsToday += 1;
    await user.save();

    const emailTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f5f5f5; padding: 20px;">
        <div style="background-color: #1a2a44; padding: 10px; text-align: center;">
          <h1 style="color: white; margin: 0;">ZvertexAI</h1>
        </div>
        <div style="background-color: white; padding: 20px; border-radius: 5px; margin-top: 10px;">
          <h2 style="color: #1a2a44;">Job Application Confirmation</h2>
          <p>Dear ${user.email},</p>
          <p>We have successfully applied to the following job on your behalf:</p>
          <ul>
            <li><strong>Job Title:</strong> ${job.title}</li>
            <li><strong>Company:</strong> ${job.company}</li>
            <li><strong>Application Status:</strong> <a href="${job.link}" style="color: #ff6d00;">Check Status</a></li>
          </ul>
          <p>Thank you for choosing ZvertexAI!</p>
          <p>Best regards,<br>ZvertexAI Team</p>
        </div>
        <div style="text-align: center; color: #757575; margin-top: 10px;">
          <p>© 2025 ZvertexAI. All rights reserved.</p>
        </div>
      </div>
    `;
    await sendEmail(user.email, 'ZvertexAI Job Application Confirmation', emailTemplate);
    await sendEmail('zvertex.247@gmail.com', 'ZvertexAI Job Application Notification', emailTemplate);
  }
  res.json({ message: 'Applied', job });
});

router.post('/apply-with-docs', async (req, res) => {
  const { jobId, company, link } = req.body;
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);

  if (!user.isVerified) return res.status(400).json({ error: 'Account not verified' });
  if (user.submissionsToday >= user.submissions) {
    return res.status(400).json({ error: 'Daily submission limit reached' });
  }

  const job = new Job({ 
    jobId, 
    title: `Job ${jobId}`, 
    company, 
    link, 
    applied: true, 
    user: user._id, 
    requiresDocs: true 
  });
  await job.save();
  user.jobsApplied.push(job._id);
  user.submissionsToday += 1;
  await user.save();

  const emailTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f5f5f5; padding: 20px;">
      <div style="background-color: #1a2a44; padding: 10px; text-align: center;">
        <h1 style="color: white; margin: 0;">ZvertexAI</h1>
      </div>
      <div style="background-color: white; padding: 20px; border-radius: 5px; margin-top: 10px;">
        <h2 style="color: #1a2a44;">Job Application Confirmation with Documents</h2>
        <p>Dear ${user.email},</p>
        <p>We have successfully applied to the following job with documents on your behalf:</p>
        <ul>
          <li><strong>Job Title:</strong> ${job.title}</li>
          <li><strong>Company:</strong> ${job.company}</li>
          <li><strong>Application Status:</strong> <a href="${job.link}" style="color: #ff6d00;">Check Status</a></li>
        </ul>
        <p>Thank you for choosing ZvertexAI!</p>
        <p>Best regards,<br>ZvertexAI Team</p>
      </div>
      <div style="text-align: center; color: #757575; margin-top: 10px;">
        <p>© 2025 ZvertexAI. All rights reserved.</p>
      </div>
    </div>
  `;
  await sendEmail(user.email, 'ZvertexAI Job Application Confirmation with Documents', emailTemplate);
  await sendEmail('zvertex.247@gmail.com', 'ZvertexAI Job Application Notification with Documents', emailTemplate);

  res.json({ message: 'Applied with documents' });
});

router.get('/tracker', async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const jobs = await Job.find({ user: decoded.id });
  res.json(jobs);
});

module.exports = router;