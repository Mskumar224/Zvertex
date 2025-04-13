const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const { parseResume } = require('../utils/automation');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Logging function
const log = (message, data = {}) => {
  console.log(`${new Date().toISOString()} - ${message}`, JSON.stringify(data, null, 2));
};

// Register
router.post('/register', async (req, res) => {
  const { email, password, subscriptionType } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      log('Registration failed: User already exists', { email });
      return res.status(400).json({ msg: 'User already exists' });
    }

    const customer = await stripe.customers.create({ email });
    user = new User({
      email,
      password: await bcrypt.hash(password, 10),
      subscriptionType: subscriptionType || 'STUDENT',
      stripeCustomerId: customer.id,
      profiles: [],
      subscriptionStatus: 'TRIAL',
      trialStart: new Date(),
    });

    await user.save();
    log('User registered successfully', { email, subscriptionType });

    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, email: user.email, subscriptionType: user.subscriptionType, profiles: user.profiles, subscriptionStatus: user.subscriptionStatus });
  } catch (err) {
    log('Registration error', { error: err.message });
    res.status(500).json({ msg: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      log('Login failed: Invalid credentials', { email });
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      log('Login failed: Invalid credentials', { email });
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check trial expiration
    if (user.subscriptionStatus === 'TRIAL') {
      const trialEnd = new Date(user.trialStart);
      trialEnd.setDate(trialEnd.getDate() + 4);
      if (new Date() > trialEnd) {
        user.subscriptionStatus = 'EXPIRED';
        await user.save();
      }
    }

    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    log('User logged in successfully', { email });

    res.json({ token, email: user.email, subscriptionType: user.subscriptionType, profiles: user.profiles, subscriptionStatus: user.subscriptionStatus });
  } catch (err) {
    log('Login error', { error: err.message });
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get User Info
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      log('User not found', { userId: req.user.id });
      return res.status(404).json({ msg: 'User not found' });
    }
    log('Fetched user info', { email: user.email });
    res.json({ email: user.email, subscriptionType: user.subscriptionType, profiles: user.profiles, subscriptionStatus: user.subscriptionStatus });
  } catch (err) {
    log('Fetch user error', { error: err.message });
    res.status(500).json({ msg: 'Server error' });
  }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      log('Forgot password: User not found', { email });
      return res.status(404).json({ msg: 'User not found' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const resetLink = `${process.env.CLIENT_URL || 'https://zvertexai.com'}/reset-password/${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <h3>Reset Your Password</h3>
        <p>Click the link below to reset your password:</p>
        <p><a href="${resetLink}">Reset Password</a></p>
        <p>This link expires in 1 hour.</p>
        <p>ZvertexAI Team</p>
      `,
    });

    log('Password reset link sent', { email });
    res.json({ msg: 'Password reset link sent to your email' });
  } catch (err) {
    log('Forgot password error', { error: err.message });
    res.status(500).json({ msg: 'Server error' });
  }
});

// Reset Password
router.post('/reset-password/:token', async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      log('Reset password: User not found', { userId: decoded.id });
      return res.status(404).json({ msg: 'User not found' });
    }

    user.password = await bcrypt.hash(password, 10);
    await user.save();
    log('Password reset successfully', { email: user.email });

    res.json({ msg: 'Password reset successfully' });
  } catch (err) {
    log('Reset password error', { error: err.message });
    res.status(400).json({ msg: 'Invalid or expired token' });
  }
});

// Contact Us
router.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'support@zvertexai.com',
      subject: `Contact Us Message from ${name}`,
      html: `
        <h3>New Contact Message</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    });

    log('Contact message sent', { email, name });
    res.json({ msg: 'Message sent successfully' });
  } catch (err) {
    log('Contact message error', { error: err.message });
    res.status(500).json({ msg: 'Failed to send message' });
  }
});

// Upload Resume and Create Profile
router.post('/profile', authMiddleware, async (req, res) => {
  const { name, phone, technologies, companies, resume } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      log('Profile creation: User not found', { userId: req.user.id });
      return res.status(404).json({ msg: 'User not found' });
    }

    let parsedResume = {};
    if (resume) {
      parsedResume = await parseResume(resume);
    }

    const profile = {
      name: name || parsedResume.name || 'Default Profile',
      phone: phone || parsedResume.phone || '',
      technologies: technologies || parsedResume.technologies || [],
      companies: companies || [],
      resume: resume || '',
      appliedJobs: [],
    };

    user.profiles.push(profile);
    await user.save();
    log('Profile created', { email: user.email, profileName: profile.name });

    res.json({ profiles: user.profiles });
  } catch (err) {
    log('Profile creation error', { error: err.message });
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update Profile
router.put('/profile/:profileId', authMiddleware, async (req, res) => {
  const { name, phone, technologies, companies, resume } = req.body;
  const { profileId } = req.params;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      log('Profile update: User not found', { userId: req.user.id });
      return res.status(404).json({ msg: 'User not found' });
    }

    const profile = user.profiles.id(profileId);
    if (!profile) {
      log('Profile update: Profile not found', { profileId });
      return res.status(404).json({ msg: 'Profile not found' });
    }

    let parsedResume = {};
    if (resume) {
      parsedResume = await parseResume(resume);
    }

    profile.name = name || profile.name;
    profile.phone = phone || profile.phone;
    profile.technologies = technologies || profile.technologies;
    profile.companies = companies || profile.companies;
    profile.resume = resume || profile.resume;

    await user.save();
    log('Profile updated', { email: user.email, profileName: profile.name });

    res.json({ profiles: user.profiles });
  } catch (err) {
    log('Profile update error', { error: err.message });
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete Profile
router.delete('/profile/:profileId', authMiddleware, async (req, res) => {
  const { profileId } = req.params;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      log('Profile deletion: User not found', { userId: req.user.id });
      return res.status(404).json({ msg: 'User not found' });
    }

    const profile = user.profiles.id(profileId);
    if (!profile) {
      log('Profile deletion: Profile not found', { profileId });
      return res.status(404).json({ msg: 'Profile not found' });
    }

    user.profiles.pull(profileId);
    await user.save();
    log('Profile deleted', { email: user.email, profileId });

    res.json({ profiles: user.profiles });
  } catch (err) {
    log('Profile deletion error', { error: err.message });
    res.status(500).json({ msg: 'Server error' });
  }
});

// Subscribe
router.post('/subscribe', authMiddleware, async (req, res) => {
  const { subscriptionType } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      log('Subscription: User not found', { userId: req.user.id });
      return res.status(404).json({ msg: 'User not found' });
    }

    const prices = {
      STUDENT: 69.99,
      RECRUITER: 149.99,
      BUSINESS: 249.99,
    };

    const session = await stripe.paymentIntents.create({
      amount: prices[subscriptionType] * 100,
      currency: 'usd',
      customer: user.stripeCustomerId,
      metadata: { userId: user._id.toString(), subscriptionType },
    });

    log('Payment intent created', { email: user.email, subscriptionType });
    res.json({ clientSecret: session.client_secret });
  } catch (err) {
    log('Subscription error', { error: err.message });
    res.status(500).json({ msg: 'Server error' });
  }
});

// Confirm Subscription
router.post('/confirm-subscription', authMiddleware, async (req, res) => {
  const { paymentIntentId } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      log('Confirm subscription: User not found', { userId: req.user.id });
      return res.status(404).json({ msg: 'User not found' });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status === 'succeeded') {
      user.subscriptionStatus = 'ACTIVE';
      await user.save();
      log('Subscription confirmed', { email: user.email });
      res.json({ email: user.email, subscriptionType: user.subscriptionType, profiles: user.profiles, subscriptionStatus: user.subscriptionStatus });
    } else {
      log('Payment intent not succeeded', { paymentIntentId });
      res.status(400).json({ msg: 'Payment not completed' });
    }
  } catch (err) {
    log('Confirm subscription error', { error: err.message });
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get Subscription Status
router.get('/subscription', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      log('Subscription status: User not found', { userId: req.user.id });
      return res.status(404).json({ msg: 'User not found' });
    }

    if (user.subscriptionStatus === 'TRIAL') {
      const trialEnd = new Date(user.trialStart);
      trialEnd.setDate(trialEnd.getDate() + 4);
      if (new Date() > trialEnd) {
        user.subscriptionStatus = 'EXPIRED';
        await user.save();
      }
    }

    log('Fetched subscription status', { email: user.email, subscriptionStatus: user.subscriptionStatus });
    res.json({ subscriptionStatus: user.subscriptionStatus });
  } catch (err) {
    log('Subscription status error', { error: err.message });
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;