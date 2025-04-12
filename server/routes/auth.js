const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

router.post('/register', async (req, res) => {
  const { name, email, password, subscriptionType } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    user = new User({
      name,
      email,
      password,
      subscriptionType: subscriptionType || 'trial',
      trialEnd: subscriptionType === 'trial' ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : undefined,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = { user: { id: user.id, subscriptionType: user.subscriptionType } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, email: user.email, subscriptionType: user.subscriptionType });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = { user: { id: user.id, subscriptionType: user.subscriptionType } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, email: user.email, subscriptionType: user.subscriptionType });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.get('/profile', async (req, res) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
});

router.post('/recruiter-profile', async (req, res) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user.id);

    if (user.subscriptionType !== 'recruiter' && user.subscriptionType !== 'business') {
      return res.status(403).json({ msg: 'Unauthorized subscription type' });
    }

    if (user.recruiterProfiles.length >= 5) {
      return res.status(400).json({ msg: 'Maximum 5 profiles allowed' });
    }

    const profile = req.body;
    user.recruiterProfiles.push(profile);
    await user.save();

    res.json(profile);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.delete('/recruiter-profile/:id', async (req, res) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user.id);

    user.recruiterProfiles = user.recruiterProfiles.filter((p, i) => i !== parseInt(req.params.id));
    await user.save();

    res.json({ msg: 'Profile deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/recruiter-profiles', async (req, res) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user.id);

    res.json(user.recruiterProfiles);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/business-recruiter', async (req, res) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user.id);

    if (user.subscriptionType !== 'business') {
      return res.status(403).json({ msg: 'Unauthorized subscription type' });
    }

    if (user.businessRecruiters.length >= 3) {
      return res.status(400).json({ msg: 'Maximum 3 recruiters allowed' });
    }

    const recruiter = { ...req.body, profiles: [] };
    user.businessRecruiters.push(recruiter);
    await user.save();

    res.json(recruiter);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/business-recruiters', async (req, res) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user.id);

    res.json(user.businessRecruiters);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;