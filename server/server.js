const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/job');
const cron = require('node-cron');
const User = require('./models/User');
const axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = ['https://zvertexai.com', 'http://localhost:3000'];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin || '*'); // Reflect origin or use '*' if no origin (e.g., Postman)
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-auth-token'],
  credentials: true,
  optionsSuccessStatus: 204,
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Explicitly handle OPTIONS preflight requests
app.options('*', (req, res) => {
  res.set({
    'Access-Control-Allow-Origin': req.headers.origin || 'https://zvertexai.com',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-auth-token',
    'Access-Control-Allow-Credentials': 'true',
  });
  res.status(204).end();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection with fallback
if (!process.env.MONGO_URI) {
  console.error('MONGO_URI is not defined. Server will run without database.');
} else {
  mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);

// Auto-apply every 30 minutes
if (process.env.JWT_SECRET) {
  cron.schedule('*/30 * * * *', async () => {
    console.log('Running auto-apply job...');
    try {
      const users = await User.find({ paid: true });
      for (const user of users) {
        if (!user.resume || !user.phone) continue;
        const technology = user.appliedJobs[0]?.technology || 'JavaScript';
        const companies = ['Google', 'Microsoft', 'Amazon', 'Tesla', 'Apple'];
        const res = await axios.post(`${process.env.API_URL || 'https://zvertexai-orzv.onrender.com'}/api/jobs/fetch`, 
          { technology, companies },
          { headers: { 'x-auth-token': jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' }) } }
        );
        const job = res.data.jobs[Math.floor(Math.random() * res.data.jobs.length)];
        await axios.post(`${process.env.API_URL || 'https://zvertexai-orzv.onrender.com'}/api/jobs/apply`, 
          { jobId: job.id, technology, userDetails: { email: user.email, phone: user.phone } },
          { headers: { 'x-auth-token': jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' }) } }
        );
        console.log(`Auto-applied ${user.email} to ${job.id} at ${job.company}`);
      }
    } catch (err) {
      console.error('Auto-Apply Error:', err);
    }
  });
} else {
  console.warn('JWT_SECRET missing. Auto-apply cron job disabled.');
}

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(), 
    mongoConnected: mongoose.connection.readyState === 1 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ msg: 'Server error', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));