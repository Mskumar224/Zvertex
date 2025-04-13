const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Multer setup for resume upload
const storage = multer.diskStorage({
  destination: './uploads/resumes',
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|doc|docx|txt/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Invalid file type. Only PDF, DOC, DOCX, TXT allowed.'));
  },
});

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'zvertexai@honotech.com',
    pass: process.env.EMAIL_PASS,
  },
});

// Register user with 4-day trial
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    user = new User({
      name,
      email,
      password,
      subscription: 'Basic',
      trialStart: new Date(),
      trialActive: true,
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    // Send welcome email
    await transporter.sendMail({
      from: '"ZvertexAI" <zvertexai@honotech.com>',
      to: email,
      subject: 'Welcome to ZvertexAI - Your 4-Day Trial Starts Now!',
      html: `
        <p>Dear ${name},</p>
        <p>Welcome to ZvertexAI! Your 4-day free trial has started. Explore our AI-driven job matching, resume tools, and more.</p>
        <p><a href="https://zvertexai.com/login">Log In Now</a></p>
        <p>Best wishes,</p>
        <p>ZvertexAI Team</p>
        <p><small>Contact us at zvertexai@honotech.com for support.</small></p>
      `,
    });

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get user data (protected)
router.get('/user', async (req, res) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check trial status
    if (user.trialActive && user.trialStart) {
      const trialEnd = new Date(user.trialStart);
      trialEnd.setDate(trialEnd.getDate() + 4);
      if (new Date() > trialEnd) {
        user.trialActive = false;
        user.subscription = 'None';
        await user.save();
      }
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
});

// Update subscription (protected)
router.put('/subscription', async (req, res) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    const { subscription } = req.body;
    if (!['Basic', 'Pro', 'Enterprise'].includes(subscription)) {
      return res.status(400).json({ msg: 'Invalid subscription plan' });
    }
    user.subscription = subscription;
    user.trialActive = false;
    await user.save();
    res.json({ msg: 'Subscription updated', subscription });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Upload resume (protected)
router.post('/resume', upload.single('resume'), async (req, res) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }
    user.resume = {
      filename: req.file.filename,
      path: req.file.path,
      mimetype: req.file.mimetype,
      uploadedAt: new Date(),
    };
    await user.save();
    res.json({ msg: 'Resume uploaded successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: err.message || 'Server error' });
  }
});

// Forgot password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    await transporter.sendMail({
      from: '"ZvertexAI" <zvertexai@honotech.com>',
      to: email,
      subject: 'ZvertexAI Password Reset',
      html: `
        <p>Dear ${user.name},</p>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <p><a href="https://zvertexai.com/reset-password/${token}">Reset Password</a></p>
        <p>This link expires in 1 hour.</p>
        <p>If you didn’t request this, please ignore this email.</p>
        <p>ZvertexAI Team</p>
        <p><small>Contact us at zvertexai@honotech.com for support.</small></p>
      `,
    });

    res.json({ msg: 'Password reset link sent' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Reset password
router.post('/reset-password/:token', async (req, res) => {
  const { password } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid or expired token' });
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.json({ msg: 'Password reset successful' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;