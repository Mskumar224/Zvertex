const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const JWT_SECRET = process.env.JWT_SECRET;
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

router.post('/signup', async (req, res) => {
  const { email, password, name, phone, subscriptionType } = req.body;
  try {
    if (!email || !password || !name || !subscriptionType) {
      console.log('Signup missing fields:', { email, name, subscriptionType, hasPassword: !!password });
      return res.status(400).json({ message: 'Missing required fields', missing: { email: !email, password: !password, name: !name, subscriptionType: !subscriptionType } });
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      console.log('Signup invalid email:', email);
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Signup duplicate email:', email);
      return res.status(400).json({ message: 'Account already exists. Please login or reset your password.' });
    }

    const otp = generateOTP();
    await transporter.sendMail({
      from: '"ZvertexAI Team" <zvertexai@honotech.com>',
      to: process.env.OTP_EMAIL,
      cc: email, // Send to user’s email as well
      subject: 'ZvertexAI - OTP for Signup',
      html: `
        <div style="font-family: Roboto, Arial, sans-serif; color: #333; background: #f5f5f5; padding: 20px; border-radius: 8px;">
          <h2 style="color: #1976d2;">Welcome to ZvertexAI!</h2>
          <p>Dear ${name || 'User'},</p>
          <p>Your OTP for signup is: <strong style="font-size: 1.2em; color: #115293;">${otp}</strong></p>
          <p>This OTP is valid for 10 minutes.</p>
          <p>If you didn’t request this, please ignore this email.</p>
          <p style="color: #6B7280;">Best regards,<br>The ZvertexAI Team</p>
        </div>
      `,
    });

    const user = new User({
      email,
      password,
      name,
      phone,
      subscription: subscriptionType || 'NONE',
      selectedCompanies: ['Indeed', 'LinkedIn', 'Glassdoor'],
      selectedTechnology: 'JavaScript',
      otp,
      otpExpires: Date.now() + 10 * 60 * 1000, // 10 minutes
    });
    await user.save();
    res.status(201).json({ message: 'OTP sent to zvertex.247@gmail.com and your email', userId: user._id });
  } catch (error) {
    console.error('Signup error:', error.message);
    res.status(500).json({ message: 'Signup failed', error: error.message });
  }
});

router.post('/verify-otp', async (req, res) => {
  const { userId, otp } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.otp !== otp || Date.now() > user.otpExpires) {
      console.log('Invalid OTP for user:', userId, { otp, expires: user.otpExpires });
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.otp = null;
    user.otpExpires = null;
    user.isVerified = true; // Added to mark user as verified
    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    res.json({ token, subscription: user.subscription });
  } catch (error) {
    console.error('OTP verification error:', error.message);
    res.status(500).json({ message: 'OTP verification failed', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      console.log('Login missing fields:', { email, hasPassword: !!password });
      return res.status(400).json({ message: 'Email and password are required', missing: { email: !email, password: !password } });
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      console.log('Login invalid email:', email);
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log('Login user not found:', email);
      return res.status(400).json({ message: 'No account found. Please sign up.' });
    }
    if (!user.isVerified) {
      console.log('Login unverified user:', email);
      return res.status(403).json({ message: 'Account not verified. Please complete OTP verification.' });
    }
    if (user.password !== password) {
      console.log('Login password mismatch for:', email);
      return res.status(400).json({ message: 'Invalid password. Try resetting your password.' });
    }
    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    res.json({ token, subscription: user.subscription });
  } catch (error) {
    console.error('Live error:', error.message);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

router.get('/user', async (req, res) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).populate('profiles jobsApplied recruiters');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({
      email: user.email,
      subscription: user.subscription,
      name: user.name,
      phone: user.phone,
      profiles: user.profiles,
      jobsApplied: user.jobsApplied,
      selectedTechnology: user.selectedTechnology,
      selectedCompanies: user.selectedCompanies,
      recruiters: user.recruiters,
      additionalDetails: user.additionalDetails,
    });
  } catch (error) {
    console.error('User fetch error:', error.message);
    res.status(500).json({ message: 'User fetch failed', details: error.message });
  }
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    const resetLink = `https://zvertexai.netlify.app/reset-password?token=${token}`;
    await transporter.sendMail({
      from: '"ZvertexAI Team" <zvertexai@honotech.com>',
      to: email,
      cc: process.env.OTP_EMAIL,
      subject: 'ZvertexAI - Password Reset Request',
      html: `
        <div style="font-family: Roboto, Arial, sans-serif; color: #333; background: #f5f5f5; padding: 20px; border-radius: 8px;">
          <h2 style="color: #1976d2;">Reset Your Password</h2>
          <p>Dear ${user.name || email},</p>
          <p>Click the link below to reset your password (valid for 1 hour):</p>
          <a href="${resetLink}" style="color: #1976d2; text-decoration: none; font-weight: bold;">Reset Password</a>
          <p>If you didn’t request this, please ignore this email.</p>
          <p style="color: #6B7280;">Best regards,<br>The ZvertexAI Team</p>
        </div>
      `,
    });
    res.json({ message: 'Password reset link sent to your email' });
  } catch (error) {
    console.error('Forgot password error:', error.message);
    res.status(500).json({ message: 'Failed to send reset link', error: error.message });
  }
});

router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    user.password = newPassword;
    user.isVerified = true; // Ensure user is verified after reset
    await user.save();
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error.message);
    res.status(500).json({ message: 'Reset failed', error: error.message });
  }
});

module.exports = router;