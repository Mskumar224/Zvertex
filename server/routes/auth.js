const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const User = require('../models/User');
const logger = require('winston');

router.post('/register', async (req, res) => {
  const { name, email, password, subscriptionPlan } = req.body;
  try {
    if (!name || !email || !password || !subscriptionPlan) {
      return res.status(400).json({ msg: 'All fields are required' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ msg: 'Invalid email format' });
    }
    if (password.length < 6) {
      return res.status(400).json({ msg: 'Password must be at least 6 characters' });
    }
    if (!['Basic', 'Pro', 'Enterprise'].includes(subscriptionPlan)) {
      return res.status(400).json({ msg: 'Invalid subscription plan' });
    }

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword,
      subscription: 'Trial',
      subscriptionPlan,
      trialActive: true,
      trialStart: new Date(),
    });

    await user.save();

    const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET || 'your_jwt_secret', {
      expiresIn: '1h',
    });

    res.json({ token });
  } catch (err) {
    logger.error(`${new Date().toISOString()} - Register Error: ${err.message}`);
    res.status(500).json({ msg: 'Server error' });
  }
});

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

    const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET || 'your_jwt_secret', {
      expiresIn: '1h',
    });

    res.json({ token });
  } catch (err) {
    logger.error(`${new Date().toISOString()} - Login Error: ${err.message}`);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    logger.error(`${new Date().toISOString()} - Get User Error: ${err.message}`);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;