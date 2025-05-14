const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Job = require('../models/Job');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

router.post('/apply', async (req, res) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    const { technology, companies } = req.body;
    if (!req.files?.resume || !technology || !companies) {
      return res.status(400).json({ message: 'Resume, technology, and companies are required' });
    }
    const job = new Job({
      userId: req.userId,
      technology,
      companies: JSON.parse(companies),
      resume: req.files.resume.data,
      status: 'APPLIED'
    });
    await job.save();
    res.json({ message: 'Job application submitted successfully' });
  } catch (error) {
    console.error('Job apply error:', error.message);
    res.status(500).json({ message: 'Failed to apply for job', error: error.message });
  }
});

router.post('/confirm', async (req, res) => {
  const { email, technology, companies } = req.body;
  try {
    await transporter.sendMail({
      from: '"ZvertexAI Team" <zvertexai@honotech.com>',
      to: email,
      subject: 'ZvertexAI - Job Application Confirmation',
      html: `
        <div style="font-family: Roboto, Arial, sans-serif; color: #333; background: #f5f5f5; padding: 20px; borderRadius: 8px;">
          <h2 style="color: #1976d2;">Job Application Confirmation</h2>
          <p>Thank you for applying through ZvertexAI!</p>
          <p><strong>Technology:</strong> ${technology}</p>
          <p><strong>Companies:</strong> ${companies.join(', ')}</p>
          <p>We have received your application and will process it soon.</p>
          <p>Contact: <a href="mailto:zvertex.247@gmail.com">zvertex.247@gmail.com</a> or +1(918) 924-5130</p>
          <p style="color: #6B7280;">Best regards,<br>The ZvertexAI Team</p>
        </div>
      `
    });
    res.json({ message: 'Confirmation email sent successfully' });
  } catch (error) {
    console.error('Confirmation email error:', error.message);
    res.status(500).json({ message: 'Failed to send confirmation email', error: error.message });
  }
});

module.exports = router;