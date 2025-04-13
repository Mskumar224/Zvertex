const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
require('dotenv').config();

// Register
router.post('/register', async (req, res) => {
  const { name, email, password, profile } = req.body;
  try {
    if (!name || !email || !password || !profile || !profile.jobTitle || !profile.skills || !profile.location) {
      return res.status(400).json({ msg: 'All fields are required' });
    }
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });
    user = new User({
      name,
      email,
      password,
      profile,
      subscriptionStatus: 'TRIAL',
      trialStart: new Date(),
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user.id, name, email, profile, subscriptionStatus: user.subscriptionStatus } });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Login
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
    res.json({ token, user: { id: user.id, name: user.name, email, profile: user.profile, subscriptionStatus: user.subscriptionStatus } });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get user
router.get('/me', async (req, res) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user.id).select('-password');
    if (!user) return res.status(400).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
});

// Forgot password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) return res.status(400).json({ msg: 'Email is required' });
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User not found' });
    const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });
    const mailOptions = {
      from: 'zvertexai@honotech.com',
      to: email,
      subject: 'Password Reset',
      text: `Click this link to reset your password: ${process.env.CLIENT_URL}/reset-password/${token}`,
    };
    await transporter.sendMail(mailOptions);
    res.json({ msg: 'Password reset email sent' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Reset password
router.post('/reset-password/:token', async (req, res) => {
  const { password } = req.body;
  try {
    if (!password) return res.status(400).json({ msg: 'Password is required' });
    const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user.id);
    if (!user) return res.status(400).json({ msg: 'Invalid token' });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    res.json({ msg: 'Password reset successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ msg: 'Invalid or expired token' });
  }
});

// Subscribe
router.post('/subscribe', async (req, res) => {
  const { token, plan } = req.body;
  try {
    if (!token || !plan) {
      return res.status(400).json({ msg: 'Payment token and plan are required' });
    }
    const decoded = jwt.verify(req.header('x-auth-token'), process.env.JWT_SECRET);
    const user = await User.findById(decoded.user.id);
    if (!user) return res.status(400).json({ msg: 'User not found' });
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const paymentMethod = await stripe.paymentMethods.create({
      type: 'card',
      card: { token },
    });
    const customer = await stripe.customers.create({
      email: user.email,
      payment_method: paymentMethod.id,
      invoice_settings: { default_payment_method: paymentMethod.id },
    });
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: plan }],
      expand: ['latest_invoice.payment_intent'],
    });
    user.stripeCustomerId = customer.id;
    user.subscriptionStatus = 'ACTIVE';
    user.subscriptionPlan = plan;
    await user.save();
    res.json({ msg: 'Subscription successful', subscription });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Subscription failed' });
  }
});

module.exports = router;