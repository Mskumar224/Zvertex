const express = require('express');
const router = express.Router();
const User = require('../models/User');
const SubscriptionRequest = require('../models/SubscriptionRequest');
const { sendEmail } = require('../utils/email');

router.post('/submit', async (req, res) => {
  const { name, email, phone, plan } = req.body;

  // Validate input
  if (!name || !email || !phone || !plan) {
    console.error('Missing required fields:', { name, email, phone, plan });
    return res.status(400).json({ error: 'All fields (name, email, phone, plan) are required' });
  }

  // Validate plan
  const validPlans = ['STUDENT', 'RECRUITER', 'BUSINESS'];
  if (!validPlans.includes(plan)) {
    console.error('Invalid plan:', plan);
    return res.status(400).json({ error: 'Invalid plan specified' });
  }

  try {
    const subscriptionRequest = new SubscriptionRequest({
      name,
      email,
      phone,
      plan,
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
    console.error('Subscription submission error:', error.message);
    res.status(400).json({ error: `Submission failed: ${error.message}` });
  }
});

module.exports = router;