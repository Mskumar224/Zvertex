const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

// Middleware to verify token and subscription
const auth = async (req, res, next) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    if (!['Pro', 'Enterprise'].includes(user.subscription) && !user.trialActive) {
      return res.status(403).json({ msg: 'Pro or Enterprise subscription required for ZGPT' });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error(err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// ZGPT query
router.post('/query', auth, async (req, res) => {
  const { prompt } = req.body;
  try {
    // Mock AI response (replace with actual AI model integration)
    const response = `ZGPT response to "${prompt}": This is a simulated response to help with your career or project query. For example, if you asked about resume tips, I’d suggest tailoring your resume to each job and using action verbs.`;
    res.json({ response });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Error processing ZGPT query' });
  }
});

module.exports = router;