const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');

// @route   POST api/auth/register
// @desc    Register user with 7-day trial
// @access  Public
router.post(
  '/register',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
    check('subscriptionType', 'Subscription type must be Student, Recruiter, or Business').isIn([
      'Student',
      'Recruiter',
      'Business',
    ]),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array(), msg: 'Invalid registration data' });
    }

    const { email, password, subscriptionType } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }

      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 7);

      user = new User({
        email,
        password,
        subscriptionType,
        trialEndDate,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
          subscriptionType: user.subscriptionType,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: '7d' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error('Registration server error:', err.message);
      res.status(500).json({ msg: 'Server error during registration' });
    }
  }
);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), msg: 'Invalid login data' });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!user || !isMatch) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      const payload = {
        user: {
          id: user.id,
          subscriptionType: user.subscriptionType,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: '7d' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: 'Server error' });
    }
  }
);

// @route   GET api/auth
// @desc    Get user data
// @access  Private
router.get('/', async (req, res) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, config.get('jwtSecret'));
    const user = await User.findById(decoded.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('Auth error:', err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
});

// @route   PUT api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', async (req, res) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, config.get('jwtSecret'));
    const user = await User.findById(decoded.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const { profile, technologies, companies } = req.body;

    if (user.subscriptionType === 'Student') {
      user.technologies = technologies || user.technologies;
      user.companies = companies || user.companies;
    } else if (user.subscriptionType === 'Recruiter' || user.subscriptionType === 'Business') {
      if (profile) {
        const existingProfile = user.profiles.find((p) => p.id === profile.id);
        if (existingProfile) {
          existingProfile.technologies = profile.technologies || existingProfile.technologies;
          existingProfile.companies = profile.companies || existingProfile.companies;
        } else if (user.profiles.length < (user.subscriptionType === 'Recruiter' ? 5 : 3)) {
          user.profiles.push({
            id: profile.id,
            technologies: profile.technologies || [],
            companies: profile.companies || [],
            appliedJobs: [],
          });
        }
      }
    }

    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;