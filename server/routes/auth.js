const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Otp = require('../models/Otp');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

// Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Request OTP
router.post('/request-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    // Generate and store OTP
    const otp = generateOTP();
    await Otp.create({ email, otp });

    // Send OTP to Zvertex.247@gmail.com
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'Zvertex.247@gmail.com',
      subject: `OTP for ${email}`,
      text: `The OTP for ${email} is: ${otp}. Valid for 5 minutes.`,
    });

    res.status(200).json({ message: 'OTP sent to Zvertex.247@gmail.com' });
  } catch (error) {
    console.error('Request OTP Error:', error.message);
    res.status(500).json({ message: 'Failed to send OTP', error: error.message });
  }
});

// Verify OTP and complete signup
router.post('/signup', async (req, res) => {
  const { email, password, otp } = req.body;
  if (!email || !password || !otp) {
    return res.status(400).json({ message: 'Email, password, and OTP are required' });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // Verify OTP
    const otpRecord = await Otp.findOne({ email, otp });
    if (!otpRecord) return res.status(400).json({ message: 'Invalid or expired OTP' });

    // Create user and mark as verified
    const user = new User({ email, password, isVerified: true });
    await user.save();

    // Delete used OTP
    await Otp.deleteOne({ email, otp });

    // Generate JWT
    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    res.status(201).json({ message: 'User created', token });
  } catch (error) {
    console.error('Signup Error:', error.message);
    res.status(500).json({ message: 'Signup failed', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    if (!user.isVerified) {
      return res.status(403).json({ message: 'Account not verified. Please complete OTP verification.' });
    }
    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    res.json({ token });
  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

module.exports = router;