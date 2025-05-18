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

    await sendEmail(user.email, 'Subscription Confirmation', `Welcome to the ${plan} plan! You can now upload ${plans[plan].resumes} resume(s) and submit up to ${plans[plan].submissions} applications per day.`);
    res.json({ message: 'Subscription successful' });
  } catch (error) {
    res.status(400).json({ error: 'Subscription failed' });
  }
});

module.exports = router;