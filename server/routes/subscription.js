const express = require('express');
const router = express.Router();
const { sendEmail } = require('../utils/email');

router.post('/submit', async (req, res) => {
  const { name, email, phone, plan } = req.body;

  // Validate input
  if (!name || !email || !phone || !plan) {
    console.error('Subscription failed: Missing fields', { name, email, phone, plan });
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Send confirmation email to ZvertexAI
    await sendEmail(
      'zvertex.247@gmail.com',
      'ZvertexAI Subscription Request',
      `
        <p>Dear ZvertexAI Team,</p>
        <p>A new subscription request has been received:</p>
        <p><span class="highlight">Name:</span> ${name}</p>
        <p><span class="highlight">Email:</span> ${email}</p>
        <p><span class="highlight">Phone:</span> ${phone}</p>
        <p><span class="highlight">Plan:</span> ${plan}</p>
        <p>Please contact the user to finalize their subscription.</p>
        <p>Thank you,<br>ZvertexAI System</p>
      `
    );

    // Send confirmation email to user
    await sendEmail(
      email,
      'ZvertexAI Subscription Confirmation',
      `
        <p>Dear ${name},</p>
        <p>Thank you for choosing the <span class="highlight">${plan}</span> plan with ZvertexAI!</p>
        <p>We have received your subscription request with the following details:</p>
        <p><span class="highlight">Email:</span> ${email}</p>
        <p><span class="highlight">Phone:</span> ${phone}</p>
        <p>Our team will contact you soon to finalize your subscription and provide access to our services.</p>
        <p>If you have any questions, please reach out to us at <a href="mailto:zvertex.247@gmail.com">zvertex.247@gmail.com</a>.</p>
        <p>Best regards,<br>ZvertexAI Team</p>
      `
    );

    res.json({ message: 'Subscription request submitted successfully.' });
  } catch (error) {
    console.error('Subscription error:', error.message);
    res.status(500).json({ error: 'Server error during subscription submission' });
  }
});

module.exports = router;