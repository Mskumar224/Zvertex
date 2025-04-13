const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config();

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'zvertexai@honotech.com',
    pass: process.env.EMAIL_PASS,
  },
});

// Contact form submission
router.post('/', async (req, res) => {
  const { name, email, message } = req.body;
  try {
    if (!name || !email || !message) {
      return res.status(400).json({ msg: 'All fields are required' });
    }
    await transporter.sendMail({
      from: '"ZvertexAI Contact" <zvertexai@honotech.com>',
      to: 'zvertexai@honotech.com',
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    });
    await transporter.sendMail({
      from: '"ZvertexAI" <zvertexai@honotech.com>',
      to: email,
      subject: 'Thank You for Contacting ZvertexAI',
      html: `
        <p>Dear ${name},</p>
        <p>Thank you for reaching out! We’ve received your message and will get back to you soon.</p>
        <p>Best regards,</p>
        <p>ZvertexAI Team</p>
        <p><small>Contact us at zvertexai@honotech.com for support.</small></p>
      `,
    });
    res.json({ msg: 'Message sent successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Error sending message' });
  }
});

module.exports = router;