const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Job = require('../models/Job');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

router.post('/apply', async (req, res) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  if (!req.files || !req.files.resume) return res.status(400).json({ message: 'No resume uploaded' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.id) throw new Error('Invalid token payload');
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Create a new Job document
    const job = new Job({
      title: `Application for ${user.selectedTechnology || 'General'}`,
      company: user.selectedCompanies?.[0] || 'Various',
      location: 'Remote', // Placeholder, can be enhanced
      postedBy: user._id
    });
    await job.save();

    // Add Job ID to user's jobsApplied array
    user.jobsApplied.push(job._id);
    user.resumes += 1;
    await user.save();

    // Send email confirmation with Job ID
    await transporter.sendMail({
      from: '"ZvertexAI Team" <zvertexai@honotech.com>',
      to: process.env.OTP_EMAIL || 'zvertex.247@gmail.com',
      subject: 'ZvertexAI - Job Application Confirmation',
      html: `
        <div style="font-family: Roboto, Arial, sans-serif; color: #333; background: #f5f5f5; padding: 20px; borderRadius: 8px;">
          <h2 style="color: #1976d2;">Job Application Submitted</h2>
          <p>User (${user.email}) has submitted a job application.</p>
          <p><strong>Job ID:</strong> ${job._id}</p>
          <p><strong>Technology:</strong> ${user.selectedTechnology || 'Not specified'}</p>
          <p><strong>Companies:</strong> ${user.selectedCompanies?.join(', ') || 'Not specified'}</p>
          <p><strong>Resume count:</strong> ${user.resumes}</p>
          <p>Contact: <a href="mailto:zvertex.247@gmail.com">zvertex.247@gmail.com</a> or +1(918) 924-5130</p>
          <p style="color: #6B7280;">Best regards,<br>The ZvertexAI Team</p>
        </div>
      `
    });

    res.json({ message: 'Job application submitted successfully', jobId: job._id });
  } catch (error) {
    console.error('Job apply error:', error.message);
    res.status(500).json({ message: 'Job application failed', error: error.message });
  }
});

module.exports = router;