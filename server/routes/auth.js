const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendEmail } = require('../utils/email');

// Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    console.error('Signup failed: Missing email or password', { email, password });
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.error('Signup failed: Invalid email format', { email });
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Password length validation
  if (password.length < 6) {
    console.error('Signup failed: Password too short', { email });
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  try {
    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.error('Signup failed: Email already exists', { email });
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

    const user = new User({
      email,
      password: hashedPassword,
      otp,
      status: 'pending',
      otpExpires,
    });
    await user.save();

    // Send OTP to zvertex.247@gmail.com
    try {
      await sendEmail(
        'zvertex.247@gmail.com',
        'ZvertexAI New User Signup OTP',
        `A new user has signed up:\nEmail: ${email}\nOTP: ${otp}\nPlease approve by sharing this OTP with the user.`
      );
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError.message);
    }

    res.json({ message: 'Signup successful. Please wait for OTP approval from ZvertexAI.' });
  } catch (error) {
    console.error('Signup error:', error.message);
    res.status(500).json({ error: 'Server error during signup' });
  }
});

router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  // Validate input
  if (!email || !otp) {
    console.error('OTP verification failed: Missing email or OTP', { email, otp });
    return res.status(400).json({ error: 'Email and OTP are required' });
  }

  try {
    const user = await User.findOne({ email, otp, status: 'pending' });
    if (!user) {
      console.error('OTP verification failed: Invalid OTP or user not found', { email });
      return res.status(400).json({ error: 'Invalid OTP or user not found' });
    }

    if (user.otpExpires < Date.now()) {
      console.error('OTP verification failed: OTP expired', { email });
      return res.status(400).json({ error: 'OTP has expired' });
    }

    user.status = 'approved';
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ message: 'OTP verified. You can now log in.' });
  } catch (error) {
    console.error('OTP verification error:', error.message);
    res.status(500).json({ error: 'Server error during OTP verification' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    console.error('Login failed: Missing email or password', { email });
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.error('Login failed: User not found', { email });
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    if (user.status !== 'approved') {
      console.error('Login failed: User not approved', { email });
      return res.status(403).json({ error: 'Your account is pending approval. Please verify OTP.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.error('Login failed: Incorrect password', { email });
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, 'secret', { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ error: 'Server error during login' });
  }
});

module.exports = router;