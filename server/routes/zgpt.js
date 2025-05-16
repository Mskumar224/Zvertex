const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth');
require('dotenv').config();

router.post('/chat', auth, async (req, res) => {
  const { prompt, language } = req.body;

  if (!prompt) {
    return res.status(400).json({ msg: 'Prompt is required' });
  }

  try {
    // Use Hugging Face Inference API for Llama 3.1
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/meta-llama/Llama-3.1-8B-Instruct',
      {
        inputs: language === 'te' ? `Provide career advice in Telugu: ${prompt}` : prompt,
        parameters: { max_length: 500 },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json({ response: response.data[0].generated_text });
  } catch (err) {
    console.error('ZGPT error:', err.message);
    res.status(500).json({ msg: 'Failed to process request' });
  }
});

module.exports = router;