const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth'); // Assuming this exists or will be created
const jobRoutes = require('./routes/job');   // Routes for job fetching and applying
const cron = require('node-cron');
const User = require('./models/User');       // User model for MongoDB
const axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// CORS Configuration
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = ['https://zvertexai.com', 'http://localhost:3000'];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin || '*');
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-auth-token'],
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options('*', (req, res) => {
  res.set({
    'Access-Control-Allow-Origin': req.headers.origin || 'https://zvertexai.com',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-auth-token',
    'Access-Control-Allow-Credentials': 'true',
  });
  res.status(204).end();
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
if (!process.env.MONGO_URI) {
  console.error('MONGO_URI is not defined. Server will run without database.');
} else {
  mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));
}

// Routes
app.use('/api/auth', authRoutes); // Authentication routes (e.g., login, register)
app.use('/api/jobs', jobRoutes);  // Job-related routes (fetch, apply)

// Auto-Apply Cron Job (Existing Functionality with New JWT Integration)
if (process.env.JWT_SECRET) {
  cron.schedule('*/30 * * * *', async () => {
    console.log('Running auto-apply job...');
    try {
      const users = await User.find();
      for (const user of users) {
        if (!user.resume || !user.phone || !user.fullName || !user.address) {
          console.log(`Skipping ${user.email}: missing required details`);
          continue;
        }
        
        const technology = user.appliedJobs[0]?.technology || 'JavaScript';
        const companies = ['Google', 'Microsoft', 'Amazon', 'Tesla', 'Apple'];
        const randomCompanies = companies.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 4) + 2);
        
        // Generate JWT token for authenticated request
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const fetchRes = await axios.post(`${process.env.API_URL || 'http://localhost:5000'}/api/jobs/fetch`, 
          { technology, companies: randomCompanies },
          { headers: { 'x-auth-token': token } }
        );

        if (!fetchRes.data.jobs || fetchRes.data.jobs.length === 0) {
          console.log(`No jobs found for ${user.email}`);
          continue;
        }
        
        const availableJobs = fetchRes.data.jobs.filter(job => 
          !user.appliedJobs.some(applied => applied.jobId === job.id)
        );
        if (availableJobs.length === 0) {
          console.log(`No new jobs for ${user.email}`);
          continue;
        }
        
        const job = availableJobs[Math.floor(Math.random() * availableJobs.length)];
        
        await axios.post(`${process.env.API_URL || 'http://localhost:5000'}/api/jobs/apply`, 
          { 
            jobId: job.id, 
            technology, 
            userDetails: { 
              email: user.email, 
              phone: user.phone, 
              fullName: user.fullName, 
              address: user.address 
            },
            jobTitle: job.title,
            company: job.company,
            jobUrl: job.url
          },
          { headers: { 'x-auth-token': token } }
        ).catch(err => console.error(`Auto-apply error for ${user.email}:`, err.response?.data || err));
        
        console.log(`Auto-applied ${user.email} to ${job.title} at ${job.company} (ID: ${job.id})`);
      }
    } catch (err) {
      console.error('Auto-Apply Error:', err);
    }
  });
} else {
  console.warn('JWT_SECRET missing. Auto-apply cron job disabled.');
}

// Health Check Endpoint (Existing)
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(), 
    mongoConnected: mongoose.connection.readyState === 1 
  });
});

// Error Handling Middleware (Existing)
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ msg: 'Server error', error: err.message });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));