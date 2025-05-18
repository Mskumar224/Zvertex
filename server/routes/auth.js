const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../utils/email');

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  try {
    let user = await User.findOne({ email });
    if (user) {
      if (!user.isVerified) {
        // Allow re-signup for unverified users
        await User.deleteOne({ email });
      } else {
        return res.status(400).json({ message: 'User already exists and is verified' });
      }
    }

    const otp = generateOTP();
    user = new User({ email, password, otp });
    await user.save();

    // Send OTP to company email
    await sendEmail(
      'zvertex.247@gmail.com',
      'New User OTP Request',
      `A new user signed up with email: ${email}. OTP: ${otp}. Please provide this OTP to the user upon request.`
    );

    res.status(201).json({ message: 'User created. Please request OTP from ZvertexAI team to verify your account.' });
  } catch (error) {
    res.status(500).json({ message: 'Signup failed', error: error.message });
  }
});

router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });
    if (user.isVerified) return res.status(400).json({ message: 'User already verified' });
    if (user.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });

    user.isVerified = true;
    user.otp = null; // Clear OTP after verification
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token, message: 'OTP verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'OTP verification failed', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found. Please sign up.' });
    if (!user.isVerified) return res.status(400).json({ message: 'Account not verified. Please sign up again to receive a new OTP.' });
    if (user.password !== password) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

module.exports = router;