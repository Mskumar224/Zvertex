const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

router.post('/subscribe', async (req, res) => {
  const { plan } = req.body;
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    user.pendingSubscription = plan;
    await user.save();

    await transporter.sendMail({
      from: '"ZvertexAI Team" <zvertexai@honotech.com>',
      to: process.env.OTP_EMAIL,
      subject: 'ZvertexAI - OTP for Subscription',
      html: `
        <div style="font-family: Roboto, Arial, sans-serif; color: #333;">
          <h2 style="color: #1976d2;">Your OTP for Subscription</h2>
          <p>Dear User,</p>
          <p>Your OTP for subscribing to the ${plan} plan is: <strong>${otp}</strong></p>
          <p>This OTP is valid for 10 minutes.</p>
          <p>Best regards,<br>The ZvertexAI Team</p>
        </div>
      `,
    });

    res.json({ message: `OTP sent to zvertex.247@gmail.com for ${plan} subscription`, userId: user._id });
  } catch (error) {
    console.error('Subscription error:', error); // Added for debugging
    res.status(500).json({ message: 'Subscription failed', error: error.message });
  }
});

router.post('/verify-subscription-otp', async (req, res) => {
  const { userId, otp } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.otp !== otp || Date.now() > user.otpExpires) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.subscription = user.pendingSubscription;
    user.otp = null;
    user.otpExpires = null;
    user.pendingSubscription = null;
    await user.save();

    let redirectPath;
    switch (user.subscription) {
      case 'STUDENT': redirectPath = '/student-dashboard'; break;
      case 'RECRUITER': redirectPath = '/recruiter-dashboard'; break;
      case 'BUSINESS': redirectPath = '/business-dashboard'; break;
      default: redirectPath = '/';
    }

    res.json({ message: `Subscribed to ${user.subscription} plan successfully`, redirect: redirectPath });
  } catch (error) {
    console.error('Subscription OTP verification error:', error); // Added for debugging
    res.status(500).json({ message: 'Subscription OTP verification failed', error: error.message });
  }
});

module.exports = router;