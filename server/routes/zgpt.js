const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/search', async (req, res) => {
  const { query } = req.body;
  try {
    const response = await axios.post('https://api-inference.huggingface.co/models/gpt2', {
      inputs: query,
    }, {
      headers: { Authorization: `Bearer ${process.env.HF_API_KEY}` },
    });
    res.json({ result: response.data[0].generated_text });
  } catch (err) {
    console.error('Zgpt Error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;