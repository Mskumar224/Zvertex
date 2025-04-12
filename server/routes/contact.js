const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// @route   POST /api/contact
// @desc    Submit contact form
// @access  Public
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('message').trim().notEmpty().withMessage('Message is required'),
  ],
  async (req, res) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ msg: errors.array()[0].msg });
    }

    try {
      const { name, email, message } = req.body;

      // Here, you could save to MongoDB, send an email, or log the message.
      // For simplicity, we'll just return success (extend as needed).
      console.log(`Contact form submission: ${name}, ${email}, ${message}`);

      res.json({ msg: 'Message sent successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: 'Server error' });
    }
  }
);

module.exports = router;