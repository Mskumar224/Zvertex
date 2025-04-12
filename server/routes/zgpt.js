const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

router.post('/query', async (req, res) => {
  const { query } = req.body;

  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
      { inputs: query },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
        },
      }
    );

    res.json({ text: response.data[0]?.summary_text || 'I got nothing, try again!' });
  } catch (err) {
    console.error('Hugging Face API Error:', err);
    res.status(500).json({ msg: 'Failed to process query' });
  }
});

module.exports = router;