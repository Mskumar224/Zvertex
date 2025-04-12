const express = require('express');
const router = express.Router();
const axios = require('axios');
const authMiddleware = require('../middleware/auth');

router.post('/query', authMiddleware, async (req, res) => {
  const { query } = req.body;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ msg: 'Invalid query' });
  }

  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/gpt2',
      { inputs: query },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const result = response.data[0]?.generated_text || 'No response generated.';
    res.json({ text: result });
  } catch (err) {
    console.error('Hugging Face API Error:', err.response?.data || err.message);
    res.status(500).json({ msg: 'Error fetching response from ZGPT', error: err.message });
  }
});

module.exports = router;