const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendEmail } = require('../utils/email');

// Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

router.post('/signup', async (req, res) => {
  const { email, password, subscriptionType } = req.body;

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
      subscriptionType: subscriptionType || 'Free', // Default to Free
    });
    await user.save();

    // Send OTP email to ZvertexAI
    try {
      await sendEmail(
        'zvertex.247@gmail.com',
        'ZvertexAI New User Signup OTP',
        `
          <p>Dear ZvertexAI Team,</p>
          <p>A new user has registered with the following details:</p>
          <p><span class="highlight">Email:</span> ${email}</p>
          <p><span class="highlight">Subscription Type:</span> ${user.subscriptionType}</p>
          <p><span class="highlight">OTP:</span></p>
          <p class="otp">${otp}</p>
          <p>Please review the request and share this OTP with the user to approve their account.</p>
          <p>Thank you,<br>ZvertexAI System</p>
        `
      );
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError.message);
    }

    res.json({ message: 'Signup successful. Please verify OTP to activate your account.', email });
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
      return res.status(400).json({ error: 'Invalid OTP or account not pending. Contact ZvertexAI at zvertex.247@gmail.com.' });
    }

    if (user.otpExpires < Date.now()) {
      console.error('OTP verification failed: OTP expired', { email });
      return res.status(400).json({ error: 'OTP has expired. Please request a new OTP.' });
    }

    // Set user as approved
    user.status = 'approved';
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Send confirmation email to user
    try {
      await sendEmail(
        email,
        'ZvertexAI Account Confirmation',
        `
          <p>Dear ${email},</p>
          <p>Congratulations! Your ZvertexAI account has been successfully verified.</p>
          <p><span class="highlight">Account Details:</span></p>
          <p>Email: ${email}</p>
          <p>Subscription Type: ${user.subscriptionType}</p>
          <p>You can now log in to access our services. If you have any questions, please contact us at <a href="mailto:zvertex.247@gmail.com">zvertex.247@gmail.com</a>.</p>
          <p>Best regards,<br>ZvertexAI Team</p>
        `
      );
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError.message);
    }

    res.json({ message: 'OTP verified successfully. You can now log in without further approvals.' });
  } catch (error) {
    console.error('OTP verification error:', error.message);
    res.status(500).json({ error: 'Server error during OTP verification' });
  }
});

router.post('/resend-otp', async (req, res) => {
  const { email } = req.body;

  // Validate input
  if (!email) {
    console.error('Resend OTP failed: Missing email', { email });
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const user = await User.findOne({ email, status: 'pending' });
    if (!user) {
      console.error('Resend OTP failed: User not found or already approved', { email });
      return res.status(400).json({ error: 'User not found or already approved. Please try logging in.' });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send new OTP email
    try {
      await sendEmail(
        'zvertex.247@gmail.com',
        'ZvertexAI Resend OTP Request',
        `
          <p>Dear ZvertexAI Team,</p>
          <p>A user has requested a new OTP for account verification:</p>
          <p><span class="highlight">Email:</span> ${email}</p>
          <p><span class="highlight">Subscription Type:</span> ${user.subscriptionType}</p>
          <p><span class="highlight">OTP:</span></p>
          <p class="otp">${otp}</p>
          <p>Please review and share this OTP with the user to approve their account.</p>
          <p>Thank you,<br>ZvertexAI System</p>
        `
      );
    } catch (emailError) {
      console.error('Failed to send resend OTP email:', emailError.message);
    }

    res.json({ message: 'New OTP sent to ZvertexAI. Please contact ZvertexAI to receive it.' });
  } catch (error) {
    console.error('Resend OTP error:', error.message);
    res.status(500).json({ error: 'Server error during OTP resend' });
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
      const otp = generateOTP();
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
      user.otp = otp;
      user.otpExpires = otpExpires;
      await user.save();

      try {
        await sendEmail(
          'zvertex.247@gmail.com',
          'ZvertexAI Login OTP Request',
          `
            <p>Dear ZvertexAI Team,</p>
            <p>A user has attempted to log in and requires OTP verification:</p>
            <p><span class="highlight">Email:</span> ${email}</p>
            <p><span class="highlight">Subscription Type:</span> ${user.subscriptionType}</p>
            <p><span class="highlight">OTP:</span></p>
            <p class="otp">${otp}</p>
            <p>Please review and share this OTP with the user to approve their account.</p>
            <p>Thank you,<br>ZvertexAI System</p>
          `
        );
      } catch (emailError) {
        console.error('Failed to send login OTP email:', emailError.message);
      }

      console.error('Login failed: User not approved', { email });
      return res.status(403).json({ 
        error: 'Your account is pending OTP approval. A new OTP has been sent to ZvertexAI for verification.',
        code: 'pending_otp'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.error('Login failed: Incorrect password', { email });
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ error: 'Server error during login' });
  }
});

module.exports = router;