const express = require('express');
const router = express.Router();
const User = require('../models/User');
const SubscriptionRequest = require('../models/SubscriptionRequest');
const { sendEmail } = require('../utils/email');
const jwt = require('jsonwebtoken');

router.post('/submit', async (req, res) => {
  const { name, email, phone, plan } = req.body;
  const token = req.headers.authorization?.split(' ')[1];

  try {
    let userId;
    if (token) {
      const decoded = jwt.verify(token, 'secret');
      const user = await User.findById(decoded.id);
      if (user) userId = user._id;
    }

    const subscriptionRequest = new SubscriptionRequest({
      name,
      email,
      phone,
      plan,
      user: userId,
    });
    await subscriptionRequest.save();

    // Send confirmation email to user
    await sendEmail(
      email,
      'ZvertexAI Subscription Request',
      `Thank you, ${name}, for your interest in the ${plan} plan! Our team will contact you at ${phone} to finalize your subscription.`
    );

    // Notify admin (EMAIL_USER)
    await sendEmail(
      process.env.EMAIL_USER,
      'New ZvertexAI Subscription Request',
      `New request for ${plan} plan:\nName: ${name}\nEmail: ${email}\nPhone: ${phone}`
    );

    // Notify zvertex.247@gmail.com
    await sendEmail(
      'zvertex.247@gmail.com',
      'New ZvertexAI Subscription Request',
      `New request for ${plan} plan:\nName: ${name}\nEmail: ${email}\nPhone: ${phone}`
    );

    res.json({ message: 'Submission successful' });
  } catch (error) {
    res.status(400).json({ error: 'Submission failed' });
  }
});

module.exports = router;