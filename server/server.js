const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/job');
const cron = require('node-cron');
const User = require('./models/User');
const axios = require('axios');
require('dotenv').config();

const stripeKey = process.env.STRIPE_SECRET_KEY;
if (!stripeKey) console.error('STRIPE_SECRET_KEY not set');
const stripe = stripeKey ? require('stripe')(stripeKey) : null;

const app = express();

const corsOptions = {
  origin: ['https://zvertexai.com', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-auth-token'],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);

// Auto-apply every 30 minutes
cron.schedule('*/30 * * * *', async () => {
  console.log('Running auto-apply job...');
  const users = await User.find({ paid: true });
  for (const user of users) {
    if (!user.resume || !user.appliedJobs) continue;
    const technology = user.appliedJobs[0]?.technology || 'JavaScript'; // Default
    const companies = ['Google', 'Microsoft', 'Amazon']; // Mock list
    const job = { id: `auto-${Date.now()}`, title: `${technology} Job`, company: companies[Math.floor(Math.random() * companies.length)] };
    
    user.appliedJobs.push({ jobId: job.id, technology, date: new Date() });
    await user.save();
    await axios.post(`${process.env.API_URL || 'https://zvertexai-orzv.onrender.com'}/api/jobs/apply`, { jobId: job.id, technology }, {
      headers: { 'x-auth-token': jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' }) },
    });
    console.log(`Auto-applied ${user.email} to ${job.id} at ${job.company}`);
  }
});

// Payment routes remain unchanged
app.post('/api/payment/create-checkout-session', async (req, res) => {
  const { email, subscriptionType } = req.body;
  if (!stripe) return res.status(500).json({ error: 'Stripe not configured' });
  const priceMap = { STUDENT: 5999, VENDOR: 9999, BUSINESS: 0 };
  try {
    if (subscriptionType === 'BUSINESS') return res.json({ url: 'mailto:support@zvertexai.com' });
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: { currency: 'usd', product_data: { name: `${subscriptionType} Plan` }, unit_amount: priceMap[subscriptionType] },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `https://zvertexai.com/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: 'https://zvertexai.com/register',
      customer_email: email,
    });
    res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe Error:', error);
    res.status(500).json({ error: 'Failed to create checkout session', details: error.message });
  }
});

app.get('/api/payment/verify', async (req, res) => {
  const { session_id } = req.query;
  if (!stripe) return res.status(500).json({ error: 'Stripe not configured' });
  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (session.payment_status === 'paid') {
      const user = await User.findOneAndUpdate(
        { email: session.customer_email },
        { subscriptionType: session.line_items.data[0].price.product.name.split(' ')[0], paid: true },
        { new: true }
      );
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json({ success: true, user });
    } else {
      res.status(400).json({ error: 'Payment not completed' });
    }
  } catch (error) {
    console.error('Verification Error:', error);
    res.status(500).json({ error: 'Verification failed', details: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));