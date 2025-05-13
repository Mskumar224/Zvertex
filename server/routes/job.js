const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

router.post('/upload', async (req, res) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (!req.files || !req.files.resume) return res.status(400).json({ message: 'No file uploaded' });

    const resume = req.files.resume;
    if (resume.mimetype !== 'application/pdf') return res.status(400).json({ message: 'Only PDF files allowed' });

    const uploadDir = path.join(__dirname, '..', 'Uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const fileName = `${user._id}_${Date.now()}.pdf`;
    const filePath = path.join(uploadDir, fileName);
    await resume.mv(filePath);

    user.resumes = (user.resumes || 0) + 1;
    await user.save();

    await transporter.sendMail({
      from: '"ZvertexAI Team" <zvertexai@honotech.com>',
      to: process.env.OTP_EMAIL || 'zvertex.247@gmail.com',
      subject: 'ZvertexAI - Job Application Confirmation',
      html: `
        <div style="font-family: Roboto, Arial, sans-serif; color: #333; background: #f5f5f5; padding: 20px; border-radius: 8px;">
          <h2 style="color: #1976d2;">Job Application Confirmation</h2>
          <p>User (${user.email}) submitted an application:</p>
          <p><strong>Technology:</strong> ${user.selectedTechnology}</p>
          <p><strong>Companies:</strong> ${user.selectedCompanies.join(', ')}</p>
          <p><strong>Resume:</strong> ${fileName}</p>
          <p>Contact: <a href="mailto:zvertex.247@gmail.com">zvertex.247@gmail.com</a> or +1(918) 924-5130</p>
          <p style="color: #6B7280;">Best regards,<br>The ZvertexAI Team</p>
        </div>
      `
    });

    res.json({ message: 'Application submitted', filePath });
  } catch (error) {
    console.error('Upload error:', error.message);
    res.status(500).json({ message: 'Application failed', error: error.message });
  }
});

router.post('/create', async (req, res) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const { title, description, company, location } = req.body;
    if (!title || !description || !company || !location) return res.status(400).json({ message: 'Missing required fields' });

    const job = new Job({ title, description, company, location, postedBy: user._id });
    await job.save();
    res.status(201).json({ message: 'Job created', job });
  } catch (error) {
    console.error('Job creation error:', error.message);
    res.status(500).json({ message: 'Job creation failed', error: error.message });
  }
});

router.get('/all', async (req, res) => {
  try {
    const jobs = await Job.find().populate('postedBy', 'name email');
    res.json(jobs);
  } catch (error) {
    console.error('Fetch jobs error:', error.message);
    res.status(500).json({ message: 'Failed to fetch jobs', error: error.message });
  }
});

module.exports = router;