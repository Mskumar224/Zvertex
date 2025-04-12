const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const cron = require('node-cron');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('./models/User');
require('dotenv').config();

const app = express();

// Logging function
const log = (message, data = {}) => {
  console.log(`${new Date().toISOString()} - ${message}`, JSON.stringify(data, null, 2));
};

// MongoDB Connection
connectDB();

// CORS Configuration
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'https://zvertexai-orzv.onrender.com',
      'https://zvertexai.com',
      'http://localhost:3000',
    ];
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

// Handle CORS preflight requests
app.options('*', (req, res) => {
  res.set({
    'Access-Control-Allow-Origin': req.headers.origin || 'https://zvertexai-orzv.onrender.com',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-auth-token',
    'Access-Control-Allow-Credentials': 'true',
  });
  res.status(204).end();
});

// Middleware
app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  if (req.is('multipart/form-data')) {
    log('Multipart form data received', { body: req.body });
  }
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/job'));
app.use('/api/zgpt', require('./routes/zgpt'));
app.use('/api/contact', require('./routes/contact'));

// Log registered routes
log('Registered routes', {
  auth: require('./routes/auth').stack.map(r => r.route?.path).filter(Boolean),
  jobs: require('./routes/job').stack.map(r => r.route?.path).filter(Boolean),
  zgpt: require('./routes/zgpt').stack.map(r => r.route?.path).filter(Boolean),
  contact: require('./routes/contact').stack.map(r => r.route?.path).filter(Boolean),
});

// Cron Job for Auto-Applying Jobs
if (process.env.JWT_SECRET && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  cron.schedule('*/30 * * * *', async () => {
    log('Running auto-apply job...');
    try {
      const users = await User.find({
        subscriptionStatus: { $in: ['active', 'trialing'] },
        trialEnd: { $gte: new Date() },
      }).lean();

      if (!users.length) {
        log('No eligible users found for auto-apply.');
        return;
      }

      for (const user of users) {
        if (!user.resume) {
          log('Skipping user due to missing resume:', { email: user.email });
          continue;
        }

        const technology = user.preferredTechnology || 'software developer';
        const companies = ['Google', 'Microsoft', 'Amazon', 'Tesla', 'Apple', 'Meta', 'IBM', 'Oracle', 'Intel', 'Cisco'];
        const randomCompanies = companies.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 8) + 2);

        const token = jwt.sign({ user: { id: user._id } }, process.env.JWT_SECRET, { expiresIn: '1h' });
        log('Fetching jobs with:', { technology, companies: randomCompanies });

        const apiUrl = process.env.API_URL || 'https://zvertexai-orzv.onrender.com';
        const fetchRes = await axios.post(
          `${apiUrl}/api/jobs/fetch`,
          { technology, companies: randomCompanies },
          { headers: { 'x-auth-token': token } }
        ).catch(err => {
          log('Job fetch error:', { error: err.message, status: err.response?.status });
          throw err;
        });

        log('Fetch response:', { jobs: fetchRes.data.jobs.length });
        if (!fetchRes.data.jobs.length) continue;

        const availableJobs = fetchRes.data.jobs.filter(job =>
          !user.jobApplications?.some(applied => applied.jobId === job.id)
        );
        if (!availableJobs.length) {
          log('No new jobs available for user:', { email: user.email });
          continue;
        }

        const job = availableJobs[Math.floor(Math.random() * availableJobs.length)];
        await axios.post(
          `${apiUrl}/api/jobs/apply`,
          {
            jobId: job.id,
            jobUrl: job.redirect_url,
            jobTitle: job.title,
            company: job.company,
          },
          { headers: { 'x-auth-token': token } }
        ).catch(err => {
          log('Job apply error:', { error: err.message, status: err.response?.status });
          throw err;
        });

        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
        });

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: 'ZvertexAI Job Application Confirmation',
          text: `Dear ${user.name},\n\nYour application for ${job.title} at ${job.company} has been submitted successfully!\n\nBest regards,\nZvertexAI Team`,
        });

        log(`Auto-applied ${user.email} to ${job.title} at ${job.company} (ID: ${job.id})`);
      }
    } catch (err) {
      log('Auto-Apply Error:', { error: err.message });
    }
  });
} else {
  log('Missing JWT_SECRET, EMAIL_USER, or EMAIL_PASS. Auto-apply cron job disabled.');
}

// Serve Frontend in Production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '../client/build/index.html'))
  );
}

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    mongoConnected: mongoose.connection.readyState === 1,
  });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  log('Server Error:', { error: err.message, stack: err.stack });
  res.status(500).json({ msg: 'Server error', error: err.message });
});

// Process Error Handlers
process.on('uncaughtException', (err) => {
  log('Uncaught Exception:', { error: err.message, stack: err.stack });
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  log('Unhandled Rejection:', { reason: reason.message || reason, promise });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => log(`Server running on port ${PORT}`));