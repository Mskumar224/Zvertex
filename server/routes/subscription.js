const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { sendEmail } = require('../utils/email');
const jwt = require('jsonwebtoken');

router.get('/plans', (req, res) => {
  res.json([
    { id: 'student', name: 'Student', price: 0, resumes: 1, submissions: 45, description: 'Perfect for students starting their career.' },
    { id: 'recruiter', name: 'Recruiter', price: 0, resumes: 5, submissions: 45, description: 'Ideal for recruiters managing multiple profiles.' },
    { id: 'business', name: 'Business', price: 0, resumes: 3, submissions: 145, description: 'Designed for businesses hiring at scale.' }
  ]);
});

router.post('/subscribe', async (req, res) => {
  const { plan } = req.body;
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);

  const plans = {
    STUDENT: { resumes: 1, submissions: 45 },
    RECRUITER: { resumes: 5, submissions: 45 },
    BUSINESS: { resumes: 3, submissions: 145 },
  };

  try {
    user.subscription = plan;
    user.resumes = plans[plan].resumes;
    user.submissions = plans[plan].submissions;
    await user.save();

    const emailTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f5f5f5; padding: 20px;">
        <div style="background-color: #1a2a44; padding: 10px; text-align: center;">
          <h1 style="color: white; margin: 0;">ZvertexAI</h1>
        </div>
        <div style="background-color: white; padding: 20px; border-radius: 5px; margin-top: 10px;">
          <h2 style="color: #1a2a44;">Subscription Confirmation</h2>
          <p>Dear ${user.email},</p>
          <p>Welcome to the ${plan} plan! You can now:</p>
          <ul>
            <li>Upload ${plans[plan].resumes} resume(s)</li>
            <li>Submit up to ${plans[plan].submissions} applications per day</li>
          </ul>
          <p>Thank you for choosing ZvertexAI!</p>
          <p>Best regards,<br>ZvertexAI Team</p>
        </div>
        <div style="text-align: center; color: #757575; margin-top: 10px;">
          <p>© 2025 ZvertexAI. All rights reserved.</p>
        </div>
      </div>
    `;
    await sendEmail(user.email, 'ZvertexAI Subscription Confirmation', emailTemplate);
    res.json({ message: 'Subscription successful' });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(400).json({ error: 'Subscription failed' });
  }
});

module.exports = router;