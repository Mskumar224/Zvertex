const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

router.get('/user', async (req, res) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.id) {
      throw new Error('Invalid token payload');
    }
    const user = await User.findById(decoded.id)
      .populate('profiles', 'name email extractedTech extractedRole')
      .populate('recruiters', 'name email')
      .populate('jobsApplied', 'title company location jobLink');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      linkedin: user.linkedin,
      github: user.github,
      portfolio: user.portfolio,
      skills: user.skills,
      subscription: user.subscription,
      selectedTechnology: user.selectedTechnology,
      selectedCompanies: user.selectedCompanies,
      jobsApplied: user.jobsApplied,
      profiles: user.profiles,
      recruiters: user.recruiters,
      resumes: user.resumes
    });
  } catch (error) {
    console.error('Fetch user error:', error.message, error);
    res.status(500).json({ message: 'Failed to fetch user data', error: error.message });
  }
});

router.post('/signup', async (req, res) => {
  try {
    const { name, email, phone, password, subscription } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    const user = new User({
      name,
      email,
      phone,
      password,
      subscription,
      isVerified: false,
      role: subscription.toLowerCase()
    });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    await user.save();

    await transporter.sendMail({
      from: '"ZvertexAI Team" <zvertexai@honotech.com>',
      to: user.email,
      subject: 'ZvertexAI - OTP Verification',
      html: `
        <div style="font-family: Roboto, Arial, sans-serif; color: #333;">
          <h2 style="color: #1976d2;">Verify Your Account</h2>
          <p>Your OTP is <strong>${otp}</strong>. Please use it to verify your account.</p>
          <p>Contact: <a href="mailto:zvertex.247@gmail.com">zvertex.247@gmail.com</a></p>
        </div>
      `
    });

    res.json({ message: 'OTP sent to your email', userId: user._id });
  } catch (error) {
    console.error('Signup error:', error.message);
    res.status(500).json({ message: 'Signup failed', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    if (!user.isVerified) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      user.otp = otp;
      await user.save();
      await transporter.sendMail({
        from: '"ZvertexAI Team" <zvertexai@honotech.com>',
        to: user.email,
        subject: 'ZvertexAI - OTP Verification',
        html: `
          <div style="font-family: Roboto, Arial, sans-serif; color: #333;">
            <h2 style="color: #1976d2;">Verify Your Account</h2>
            <p>Your OTP is <strong>${otp}</strong>. Please use it to verify your account.</p>
            <p>Contact: <a href="mailto:zvertex.247@gmail.com">zvertex.247@gmail.com</a></p>
          </div>
        `
      });
      return res.json({ needsOtp: true, userId: user._id, message: 'OTP sent to your email' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, redirect: user.role === 'recruiter' ? '/recruiter-dashboard' : user.role === 'business' ? '/business-dashboard' : '/student-dashboard' });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

router.post('/verify-subscription-otp', async (req, res) => {
  try {
    const { userId, otp } = req.body;
    const user = await User.findById(userId);
    if (!user || user.otp !== otp) {
      return res.status(401).json({ message: 'Invalid OTP' });
    }
    user.isVerified = true;
    user.otp = null;
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, redirect: user.role === 'recruiter' ? '/recruiter-dashboard' : user.role === 'business' ? '/business-dashboard' : '/student-dashboard' });
  } catch (error) {
    console.error('OTP verification error:', error.message);
    res.status(500).json({ message: 'OTP verification failed', error: error.message });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    await transporter.sendMail({
      from: '"ZvertexAI Team" <zvertexai@honotech.com>',
      to: user.email,
      subject: 'ZvertexAI - Password Reset',
      html: `
        <div style="font-family: Roboto, Arial, sans-serif; color: #333;">
          <h2 style="color: #1976d2;">Reset Your Password</h2>
          <p>Click <a href="https://zvertexai.com/reset-password/${resetToken}">here</a> to reset your password. This link expires in 1 hour.</p>
          <p>Contact: <a href="mailto:zvertex.247@gmail.com">zvertex.247@gmail.com</a></p>
        </div>
      `
    });

    res.json({ message: 'Password reset link sent to your email' });
  } catch (error) {
    console.error('Forgot password error:', error.message);
    res.status(500).json({ message: 'Failed to send reset link', error: error.message });
  }
});

router.post('/reset-password/:token', async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error.message);
    res.status(500).json({ message: 'Failed to reset password', error: error.message });
  }
});

router.patch('/user', async (req, res) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.id) throw new Error('Invalid token payload');
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const { selectedTechnology, selectedCompanies, phone, address, linkedin, github, portfolio, skills } = req.body;
    if (selectedTechnology) user.selectedTechnology = selectedTechnology;
    if (selectedCompanies) user.selectedCompanies = selectedCompanies;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (linkedin) user.linkedin = linkedin;
    if (github) user.github = github;
    if (portfolio) user.portfolio = portfolio;
    if (skills) user.skills = skills;
    await user.save();
    res.json({ message: 'User preferences updated successfully' });
  } catch (error) {
    console.error('Update user error:', error.message);
    res.status(500).json({ message: 'Failed to update user preferences', error: error.message });
  }
});

module.exports = router;