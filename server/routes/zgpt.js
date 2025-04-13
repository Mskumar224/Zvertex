const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const logger = require('winston');

router.post('/query', auth, async (req, res) => {
  const { prompt } = req.body;
  try {
    if (!prompt) {
      return res.status(400).json({ msg: 'Prompt is required' });
    }
    const user = await User.findById(req.user.id);
    if (!['Pro', 'Enterprise'].includes(user.subscription)) {
      return res.status(403).json({ msg: 'ZGPT requires Pro or Enterprise subscription' });
    }
    // Placeholder for ZGPT integration
    res.json({ response: `ZGPT response to: ${prompt}` });
  } catch (err) {
    logger.error(`${new Date().toISOString()} - ZGPT Error: ${err.message}`);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;