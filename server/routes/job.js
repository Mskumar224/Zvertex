const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

router.post('/apply', upload.single('resume'), async (req, res) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  if (!req.file) return res.status(400).json({ error: 'No resume uploaded' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.id) throw new Error('Invalid token payload');
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.resumes += 1;
    await user.save();

    await transporter.sendMail({
      from: '"ZvertexAI Team" <zvertexai@honotech.com>',
      to: process.env.OTP_EMAIL || 'zvertex.247@gmail.com',
      subject: 'ZvertexAI - Job Application Confirmation',
      html: `
        <div style="font-family: Roboto, Arial, sans-serif; color: #333; background: #f5f5f5; padding: 20px; borderRadius: 8px;">
          <h2 style="color: #1976d2;">Job Application Submitted</h2>
          <p>User (${user.email}) has submitted a job application.</p>
          <p>Technology: ${user.selectedTechnology || 'Not specified'}</p>
          <p>Companies: ${user.selectedCompanies?.join(', ') || 'Not specified'}</p>
          <p>Resume: ${req.file.filename}</p>
          <p>Resume count: ${user.resumes}</p>
          <p>Contact: <a href="mailto:zvertex.247@gmail.com">zvertex.247@gmail.com</a> or +1(918) 924-5130</p>
          <p style="color: #6B7280;">Best regards,<br>The ZvertexAI Team</p>
        </div>
      `,
    });

    res.json({ message: 'Job application submitted successfully' });
  } catch (error) {
    console.error('Job apply error:', error.message);
    res.status(500).json({ message: 'Job application failed', error: error.message });
  }
});

module.exports = router;