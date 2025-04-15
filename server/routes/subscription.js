const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   GET api/subscription
// @desc    Get user's subscription status
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('subscriptionStatus');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json({ subscriptionStatus: user.subscriptionStatus || 'Free' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/subscription/upgrade
// @desc    Upgrade user subscription (stubbed)
// @access  Private
router.post('/upgrade', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    // Stubbed: Update subscription status (integrate with Stripe in production)
    user.subscriptionStatus = 'Premium';
    await user.save();
    res.json({ subscriptionStatus: user.subscriptionStatus });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;