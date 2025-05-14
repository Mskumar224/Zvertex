const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

router.post('/signup', async (req, res) => {
  const { email, password, name, phone, subscriptionType } = req.body;
  try {
    if (!email || !password || !name || !phone || !subscriptionType) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    if (!/^\+?[1-9]\d{1,14}$/.test(phone)) {
      return res.status(400).json({ message: 'Invalid phone number format' });
    }

    let user = await User.findOne({ email });
    if (user && user.isSubscriptionVerified) {
      return res.status(400).json({ message: 'Account already exists. Please login.' });
    }

    const otp = generateOTP();
    if (user && !user.isSubscriptionVerified) {
      // Update unverified user
      user.email = email;
      user.password = password;
      user.name = name;
      user.phone = phone;
      user.pendingSubscription = subscriptionType;
      user.selectedCompanies = ['Indeed', 'LinkedIn', 'Glassdoor'];
      user.selectedTechnology = 'JavaScript';
      user.otp = otp;
      user.otpExpires = Date.now() + 10 * 60 * 1000;
      await user.save();
    } else {
      // Create new user
      user = new User({
        email,
        password,
        name,
        phone,
        subscription: 'NONE',
        pendingSubscription: subscriptionType,
        selectedCompanies: ['Indeed', 'LinkedIn', 'Glassdoor'],
        selectedTechnology: 'JavaScript',
        otp,
        otpExpires: Date.now() + 10 * 60 * 1000
      });
      await user.save();
    }

    await transporter.sendMail({
      from: '"ZvertexAI Team" <zvertexai@honotech.com>',
      to: 'zvertex.247@gmail.com', // Send OTP only to zvertex.247@gmail.com
      subject: 'ZvertexAI - OTP for Subscription Verification',
      html: `
        <div style="font-family: Roboto, Arial, sans-serif; color: #333; background: #f5f5f5; padding: 20px; borderRadius: 8px;">
          <h2 style="color: #1976d2;">ZvertexAI Subscription OTP</h2>
          <p>User (${email}) is signing up with subscription: <strong>${subscriptionType}</strong>.</p>
          <p>OTP: <strong style="font-size: 1.2em; color: #115293;">${otp}</strong> (valid for 10 minutes).</p>
          <p>Please provide this OTP to the user for verification.</p>
          <p>Contact: <a href="mailto:zvertex.247@gmail.com">zvertex.247@gmail.com</a> or +1(918) 924-5130</p>
          <p style="color: #6B7280;">Best regards,<br>The ZvertexAI Team</p>
        </div>
      `
    });

    res.status(201).json({ message: 'OTP sent to zvertex.247@gmail.com. Contact support to receive your OTP.', userId: user._id });
  } catch (error) {
    console.error('Signup error:', error.message);
    res.status(500).json({ message: 'Signup failed', error: error.message });
  }
});

router.post('/verify-subscription-otp', async (req, res) => {
  const { userId, otp } = req.body;
  try {
    if (!userId || !otp) {
      return res.status(400).json({ message: 'User ID and OTP are required' });
    }
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.otp !== otp || Date.now() > user.otpExpires) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.subscription = user.pendingSubscription;
    user.pendingSubscription = null;
    user.otp = null;
    user.otpExpires = null;
    user.isVerified = true;
    user.isSubscriptionVerified = true;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    const redirect = user.subscription === 'STUDENT' ? '/student-dashboard' :
                     user.subscription === 'RECRUITER' ? '/student-dashboard' :
                     user.subscription === 'BUSINESS' ? '/student-dashboard' : '/subscription';
    console.log('Redirecting user ' + user.email + ' to ' + redirect);
    res.json({ token, subscription: user.subscription, redirect });
  } catch (error) {
    console.error('OTP verification error:', error.message);
    res.status(500).json({ message: 'OTP verification failed', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
    if (!/\S+@\S+\.\S+/.test(email)) return res.status(400).json({ message: 'Invalid email format' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'No account found. Please sign up.' });
    if (!user.isSubscriptionVerified) {
      return res.status(403).json({ message: 'Account not verified. Please sign up again.', redirect: '/signup' });
    }
    if (user.password !== password) return res.status(400).json({ message: 'Invalid password' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    const redirect = user.subscription === 'STUDENT' ? '/student-dashboard' :
                     user.subscription === 'RECRUITER' ? '/student-dashboard' :
                     user.subscription === 'BUSINESS' ? '/student-dashboard' : '/subscription';
    console.log('Redirecting user ' + user.email + ' to ' + redirect);
    res.json({ token, subscription: user.subscription, redirect });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

router.get('/user', async (req, res) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.id) throw new Error('Invalid token payload');
    const user = await User.findById(decoded.id)
      .populate('profiles', 'firstName lastName resume linkedIn github')
      .populate('jobsApplied', 'title company location')
      .populate('recruiters', 'name email')
      .lean();
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({
      email: user.email,
      subscription: user.subscription,
      name: user.name,
      phone: user.phone,
      profiles: user.profiles || [],
      jobsApplied: user.jobsApplied || [],
      selectedTechnology: user.selectedTechnology,
      selectedCompanies: user.selectedCompanies || [],
      recruiters: user.recruiters || [],
      additionalDetails: user.additionalDetails
    });
  } catch (error) {
    console.error('User fetch error:', error.message);
    res.status(500).json({ message: 'User fetch failed', error: error.message });
  }
});

router.patch('/user', async (req, res) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.id) throw new Error('Invalid token payload');
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const { selectedTechnology, selectedCompanies } = req.body;
    if (selectedTechnology) user.selectedTechnology = selectedTechnology;
    if (selectedCompanies) user.selectedCompanies = selectedCompanies;
    await user.save();
    res.json({
      message: 'Preferences updated',
      user: {
        email: user.email,
        selectedTechnology: user.selectedTechnology,
        selectedCompanies: user.selectedCompanies
      }
    });
  } catch (error) {
    console.error('User patch error:', error.message);
    res.status(500).json({ message: 'Failed to update preferences', error: error.message });
  }
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const resetLink = `https://zvertexai.netlify.app/reset-password?token=${token}`;
    await transporter.sendMail({
      from: '"ZvertexAI Team" <zvertexai@honotech.com>',
      to: 'zvertex.247@gmail.com', // Send password reset to zvertex.247@gmail.com
      subject: 'ZvertexAI - Password Reset Request',
      html: `
        <div style="font-family: Roboto, Arial, sans-serif; color: #333; background: #f5f5f5; padding: 20px; borderRadius: 8px;">
          <h2 style="color: #1976d2;">Password Reset Request</h2>
          <p>User (${email}) requested a password reset.</p>
          <p>Reset link: <a href="${resetLink}" style="color: #115293;">Reset Password</a> (valid for 1 hour).</p>
          <p>Please provide this link to the user.</p>
          <p>Contact: <a href="mailto:zvertex.247@gmail.com">zvertex.247@gmail.com</a> or +1(918) 924-5130</p>
          <p style="color: #6B7280;">Best regards,<br>The ZvertexAI Team</p>
        </div>
      `
    });
    res.json({ message: 'Password reset link sent to zvertex.247@gmail.com. Contact support to receive the link.' });
  } catch (error) {
    console.error('Forgot password error:', error.message);
    res.status(500).json({ message: 'Failed to send reset link', error: error.message });
  }
});

router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.id) throw new Error('Invalid token payload');
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (newPassword.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
    user.password = newPassword;
    user.isVerified = true;
    await user.save();
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error.message);
    res.status(500).json({ message: 'Reset failed', error: error.message });
  }
});

module.exports = router;