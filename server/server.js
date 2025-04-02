const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/job');
require('dotenv').config();

// Validate Stripe key before initialization
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('Error: STRIPE_SECRET_KEY is not set in environment variables');
  process.exit(1); // Exit if key is missing
}
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('./models/User');

const app = express();

// CORS configuration
const corsOptions = {
  origin: ['https://zvertexai.com', 'http://zvertexai.com', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-auth-token'],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);

// Stripe Checkout Session Endpoint
app.post('/api/payment/create-checkout-session', async (req, res) => {
  const { email, subscriptionType } = req.body;

  if (!email || !subscriptionType) {
    return res.status(400).json({ error: 'Email and subscriptionType are required' });
  }

  const priceMap = {
    STUDENT: 5999, // $59.99 in cents
    VENDOR: 9999,  // $99.99 in cents
    BUSINESS: 0,   // Custom pricing
  };

  try {
    if (subscriptionType === 'BUSINESS') {
      return res.json({ url: 'mailto:support@zvertexai.com' });
    }

    if (!priceMap[subscriptionType]) {
      return res.status(400).json({ error: 'Invalid subscription type' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${subscriptionType} Plan`,
          },
          unit_amount: priceMap[subscriptionType],
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `https://zvertexai.com/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: 'https://zvertexai.com/register',
      customer_email: email,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe Error:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to create checkout session', details: error.message });
  }
});

// Verify Payment
app.get('/api/payment/verify', async (req, res) => {
  const { session_id } = req.query;

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (session.payment_status === 'paid') {
      const user = await User.findOneAndUpdate(
        { email: session.customer_email },
        { subscriptionType: session.line_items.data[0].description.split(' ')[0], paid: true },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ error: 'User not found after payment' });
      }
      res.json({ success: true, user });
    } else {
      res.status(400).json({ error: 'Payment not completed' });
    }
  } catch (error) {
    console.error('Verification Error:', error.message, error.stack);
    res.status(500).json({ error: 'Verification failed', details: error.message });
  }
});

app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({ msg: 'Server error', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));