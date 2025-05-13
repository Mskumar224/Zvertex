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

    if (user.isSubscriptionVerified) {
      // Skip OTP for verified users
      user.subscription = plan;
      await user.save();
      let redirectPath;
      switch (plan) {
        case 'STUDENT': redirectPath = '/student-dashboard'; break;
        case 'RECRUITER': redirectPath = '/recruiter-dashboard'; break;
        case 'BUSINESS': redirectPath = '/business-dashboard'; break;
        default: redirectPath = '/';
      }
      return res.json({ message: `Subscribed to ${plan} plan successfully`, redirect: redirectPath });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    user.pendingSubscription = plan;
    await user.save();

    await transporter.sendMail({
      from: '"ZvertexAI Team" <zvertexai@honotech.com>',
      to: process.env.OTP_EMAIL, // Send only to zvertex.247@gmail.com
      subject: 'ZvertexAI - OTP for Subscription Verification',
      html: `
        <div style="font-family: Roboto, Arial, sans-serif; color: #333; background: #f5f5f5; padding: 20px; border-radius: 8px;">
          <h2 style="color: #1976d2;">ZvertexAI Subscription OTP</h2>
          <p>Dear Admin,</p>
          <p>User (${user.email}) is subscribing to the <strong>${plan}</strong> plan.</p>
          <p>The OTP for verification is: <strong style="font-size: 1.2em; color: #115293;">${otp}</strong></p>
          <p>This OTP is valid for 10 minutes. Please provide it to the user upon request.</p>
          <p style="color: #6B7280;">Best regards,<br>The ZvertexAI Team</p>
        </div>
      `,
    });

    res.json({ message: `Please contact ZvertexAI to receive your OTP for ${plan} subscription`, userId: user._id });
  } catch (error) {
    console.error('Subscription error:', error.message);
    res.status(500).json({ message: 'Subscription failed', error: error.message });
  }
});

router.post('/verify-subscription-otp', async (req, res) => {
  const { userId, otp } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.otp !== otp || Date.now() > user.otpExpires) {
      console.log('Invalid subscription OTP for user:', userId, { otp, expires: user.otpExpires });
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.subscription = user.pendingSubscription;
    user.otp = null;
    user.otpExpires = null;
    user.pendingSubscription = null;
    user.isSubscriptionVerified = true; // Mark as verified for lifetime
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
    console.error('Subscription OTP verification error:', error.message);
    res.status(500).json({ message: 'Subscription OTP verification failed', error: error.message });
  }
});

module.exports = router;