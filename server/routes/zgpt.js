const express = require('express');
const router = express.Router();
const axios = require('axios');
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');
require('dotenv').config();

// Logging function
const log = (message, data = {}) => {
  console.log(`${new Date().toISOString()} - ${message}`, JSON.stringify(data, null, 2));
};

// Real-time ZGPT Response (Mocked with OpenAI-style API for now)
const getZGPTResponse = async (prompt) => {
  try {
    // Placeholder for real AI API (e.g., xAI Grok or OpenAI)
    const response = await axios.post(
      'https://api.openai.com/v1/completions', // Replace with actual API
      {
        model: 'text-davinci-003', // Replace with appropriate model
        prompt: `You are ZGPT, a career assistant. Provide detailed advice for: ${prompt}`,
        max_tokens: 500,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.ZGPT_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.choices[0].text.trim();
  } catch (err) {
    log('ZGPT API error', { error: err.message });
    return `ZGPT: Sorry, I couldn't fetch a response. Try asking for career tips like "How to prepare for a software engineering interview?"`;
  }
};

// ZGPT Chat
router.post('/chat', authMiddleware, async (req, res) => {
  const { prompt } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      log('ZGPT chat: User not found', { userId: req.user.id });
      return res.status(404).json({ msg: 'User not found' });
    }

    if (user.subscriptionStatus === 'EXPIRED') {
      log('ZGPT chat: Subscription expired', { email: user.email });
      return res.status(403).json({ msg: 'Subscription expired. Please subscribe to continue.' });
    }

    const response = await getZGPTResponse(prompt);
    log('ZGPT response generated', { email: user.email, prompt });

    res.json({ response });
  } catch (err) {
    log('ZGPT chat error', { error: err.message });
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;