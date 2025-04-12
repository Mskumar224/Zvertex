const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Configure multer
const upload = multer({ dest: 'uploads/' });

router.post('/register', upload.single('resume'), async (req, res) => {
  console.log(`${new Date().toISOString()} - Register request body:`, req.body);
  console.log(`${new Date().toISOString()} - Register request file:`, req.file);

  const { name, email, password } = req.body;
  try {
    // Validate inputs
    if (!name || !email || !password) {
      console.log(`${new Date().toISOString()} - Missing fields:`, { name, email, password });
      return res.status(400).json({ msg: 'Name, email, and password are required' });
    }

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    user = new User({
      name,
      email,
      password,
      resume: req.file ? req.file.path : null,
      subscriptionStatus: 'trialing',
      trialEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    if (req.file) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Welcome to ZvertexAI - Resume Received',
        text: `Hi ${name},\n\nThank you for registering with ZvertexAI! We've received your resume and will use it to match you with the best job opportunities.\n\nBest,\nZvertexAI Team`,
      });
    }

    res.json({ token, user: { id: user.id, name, email, subscriptionStatus: user.subscriptionStatus } });
  } catch (error) {
    console.error(`${new Date().toISOString()} - Register Error:`, error);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ msg: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      token,
      user: { id: user.id, name: user.name, email, subscriptionStatus: user.subscriptionStatus },
    });
  } catch (error) {
    console.error(`${new Date().toISOString()} - Login Error:`, error);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error(`${new Date().toISOString()} - Me Error:`, error);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/upload-resume', auth, upload.single('resume'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user.resume = req.file ? req.file.path : user.resume;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'ZvertexAI - Resume Updated',
      text: `Hi ${user.name},\n\nYour resume has been updated successfully!\n\nBest,\nZvertexAI Team`,
    });

    res.json({ msg: 'Resume uploaded' });
  } catch (error) {
    console.error(`${new Date().toISOString()} - Upload Resume Error:`, error);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) return res.status(400).json({ msg: 'Email is required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User not found' });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'ZvertexAI - Password Reset Request',
      text: `Hi ${user.name},\n\nYou requested a password reset. Click this link to reset your password: ${resetUrl}\n\nThis link will expire in 1 hour.\n\nBest,\nZvertexAI Team`,
    });

    res.json({ msg: 'Password reset link sent' });
  } catch (error) {
    console.error(`${new Date().toISOString()} - Forgot Password Error:`, error);
    res.status(500).json({ msg: 'Failed to send reset link' });
  }
});

router.post('/reset-password/:token', async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  try {
    if (!password) return res.status(400).json({ msg: 'Password is required' });

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ msg: 'Invalid or expired token' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ msg: 'Password reset successful' });
  } catch (error) {
    console.error(`${new Date().toISOString()} - Reset Password Error:`, error);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/subscription', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('subscriptionStatus trialEnd');
    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.json({
      plan: user.subscriptionStatus === 'trialing' ? 'Trial' : user.subscriptionStatus,
      status: user.subscriptionStatus,
      trialEnd: user.trialEnd,
    });
  } catch (error) {
    console.error(`${new Date().toISOString()} - Subscription Error:`, error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;