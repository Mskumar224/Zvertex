const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Job = require('../models/Job');
const Profile = require('../models/Profile');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

// Simulated tech and role extraction
const extractTechAndRole = (file) => {
  return {
    detectedTech: ['JavaScript', 'Python', 'Java'][Math.floor(Math.random() * 3)],
    detectedRole: ['Developer', 'Engineer', 'Consultant'][Math.floor(Math.random() * 3)]
  };
};

// Fetch real-time jobs (simulated)
const fetchRealTimeJobs = async (technology, companies) => {
  const jobs = [
    { title: `${technology} Developer`, company: companies[0] || 'Indeed', location: 'Remote', technology },
    { title: `Senior ${technology} Engineer`, company: companies[1] || 'LinkedIn', location: 'San Francisco', technology },
    { title: `${technology} Consultant`, company: companies[2] || 'Glassdoor', location: 'New York', technology }
  ].filter(job => job.company);
  return jobs;
};

router.post('/apply', async (req, res) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  if (!req.file) return res.status(400).json({ message: 'No resume uploaded' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.id) throw new Error('Invalid token payload');
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Fetch real-time jobs
    const jobsToApply = await fetchRealTimeJobs(user.selectedTechnology, user.selectedCompanies);
    if (!jobsToApply.length) throw new Error('No matching jobs found');

    const jobIds = [];
    for (const jobData of jobsToApply) {
      const job = new Job({
        title: jobData.title,
        company: jobData.company,
        location: jobData.location,
        technology: jobData.technology,
        postedBy: user._id,
        jobId: uuidv4() // Generate unique jobId
      });
      await job.save();
      user.jobsApplied.push(job._id);
      jobIds.push(job._id.toString());
    }

    user.resumes += 1;
    await user.save();

    // Send confirmation email to user
    await transporter.sendMail({
      from: '"ZvertexAI Team" <zvertexai@honotech.com>',
      to: user.email,
      subject: 'ZvertexAI - Job Application Confirmation',
      html: `
        <div style="font-family: Roboto, Arial, sans-serif; color: #333; background: #f5f5f5; padding: 20px; borderRadius: 8px;">
          <h2 style="color: #1976d2;">Job Application Confirmation</h2>
          <p>Dear ${user.name},</p>
          <p>Your application has been submitted for ${jobsToApply.length} job(s):</p>
          <ul>
            ${jobsToApply.map((job, index) => `
              <li>
                <strong>Job ID:</strong> ${jobIds[index]}<br>
                <strong>Title:</strong> ${job.title}<br>
                <strong>Company:</strong> ${job.company}<br>
                <strong>Location:</strong> ${job.location}
              </li>
            `).join('')}
          </ul>
          <p><strong>Technology:</strong> ${user.selectedTechnology || 'Not specified'}</p>
          <p><strong>Companies:</strong> ${user.selectedCompanies?.join(', ') || 'Not specified'}</p>
          <p><strong>Resume count:</strong> ${user.resumes}</p>
          <p>Contact: <a href="mailto:zvertex.247@gmail.com">zvertex.247@gmail.com</a> or +1(918) 924-5130</p>
          <p style="color: #6B7280;">Best regards,<br>The ZvertexAI Team</p>
        </div>
      `
    });

    res.json({ message: `Applied to ${jobsToApply.length} job(s) successfully`, jobIds });
  } catch (error) {
    console.error('Job apply error:', error.message, error);
    res.status(500).json({ message: 'Job application failed', error: error.message });
  }
});

router.post('/upload-profile', async (req, res) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.id) throw new Error('Invalid token payload');
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { detectedTech, detectedRole } = extractTechAndRole(req.file);
    const profile = new Profile({
      name: `Profile_${Date.now()}`,
      email: user.email,
      extractedTech: detectedTech,
      extractedRole: detectedRole,
      user: user._id
    });
    await profile.save();

    user.profiles.push(profile._id);
    await user.save();

    res.json({ profileId: profile._id, detectedTech, detectedRole });
  } catch (error) {
    console.error('Profile upload error:', error.message, error);
    res.status(500).json({ message: 'Profile upload failed', error: error.message });
  }
});

module.exports = router;