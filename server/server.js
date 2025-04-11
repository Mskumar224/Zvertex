const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/job');
const zgptRoutes = require('./routes/zgpt');
const cron = require('node-cron');
const User = require('./models/User');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

// Multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Set Mongoose strictQuery to avoid deprecation warning
mongoose.set('strictQuery', true);

// Enhanced logging function
const log = (message, data = {}) => {
  console.log(`${new Date().toISOString()} - ${message}`, JSON.stringify(data, null, 2));
};

// CORS configuration
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

// Handle preflight requests efficiently
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
app.use(upload.any());

// MongoDB Connection
if (!process.env.MONGO_URI) {
  log('MONGO_URI is not defined. Server will run without database.');
} else {
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    })
    .then(() => log('MongoDB Connected'))
    .catch((err) => log('MongoDB Connection Error:', { error: err.message }));
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/zgpt', zgptRoutes);

// Cron Job for Auto-Apply
if (process.env.JWT_SECRET) {
  cron.schedule('*/30 * * * *', async () => {
    log('Running auto-apply job...');
    try {
      const users = await User.find({ paid: true }).lean();
      if (!users.length) {
        log('No paid users found for auto-apply.');
        return;
      }

      for (const user of users) {
        if (!user.resume || !user.phone) {
          log('Skipping user due to missing resume or phone:', { email: user.email });
          continue;
        }

        const technology = user.appliedJobs[0]?.technology || 'JavaScript';
        const companies = ['Google', 'Microsoft', 'Amazon', 'Tesla', 'Apple', 'Facebook', 'IBM', 'Oracle', 'Intel', 'Cisco'];
        const randomCompanies = companies.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 9) + 2);

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        log('Fetching jobs with:', { technology, companies: randomCompanies });

        const fetchRes = await axios
          .post(
            `${process.env.API_URL || 'https://zvertexai-orzv.onrender.com'}/api/jobs/fetch`,
            { technology, companies: randomCompanies },
            { headers: { 'x-auth-token': token } }
          )
          .catch((err) => {
            log('Job fetch error:', { error: err.message, status: err.response?.status });
            throw err;
          });

        log('Fetch response:', { jobs: fetchRes.data.jobs.length });
        if (!fetchRes.data.jobs.length) continue;

        const availableJobs = fetchRes.data.jobs.filter(
          (job) => !user.appliedJobs.some((applied) => applied.jobId === job.id)
        );
        if (!availableJobs.length) {
          log('No new jobs available for user:', { email: user.email });
          continue;
        }

        const job = availableJobs[Math.floor(Math.random() * availableJobs.length)];
        await axios
          .post(
            `${process.env.API_URL || 'https://zvertexai-orzv.onrender.com'}/api/jobs/apply`,
            {
              jobId: job.id,
              technology,
              userDetails: { email: user.email, phone: user.phone },
              jobTitle: job.title,
              company: job.company,
            },
            { headers: { 'x-auth-token': token } }
          )
          .catch((err) => {
            log('Job apply error:', { error: err.message, status: err.response?.status });
            throw err;
          });

        // Send email confirmation
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        await transporter.sendMail({
          from: '"ZvertexAI" <no-reply@zvertexai.com>',
          to: user.email,
          subject: `Auto-Application: ${job.title} at ${job.company}`,
          html: `
            <h2>Application Confirmation</h2>
            <p>Dear ${user.email},</p>
            <p>Your application for <strong>${job.title}</strong> at <strong>${job.company}</strong> has been submitted automatically.</p>
            <p>This application was processed in association with <strong>Hono Technology</strong>.</p>
            <p>We’ll notify you of any updates. For inquiries, contact us at support@zvertexai.com.</p>
            <p>Best regards,<br/>ZvertexAI Team</p>
          `,
        });

        log(`Auto-applied ${user.email} to ${job.title} at ${job.company} (ID: ${job.id})`);
      }
    } catch (err) {
      log('Auto-Apply Error:', { error: err.message });
    }
  });
} else {
  log('JWT_SECRET missing. Auto-apply cron job disabled.');
}

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    mongodbConnected: mongoose.connection.readyState === 1,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  log('Server Error:', { error: err.message, stack: err.stack });
  res.status(500).json({ msg: 'Server error', error: err.message });
});

// Start Server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => log(`Server running on port ${PORT}`));

// Handle Uncaught Exceptions
process.on('uncaughtException', (err) => {
  log('Uncaught Exception:', { error: err.message, stack: err.stack });
  process.exit(1);
});

// Handle Unhandled Promise Rejections
process.on('unhandledRejection', (reason, promise) => {
  log('Unhandled Rejection:', { reason: reason.message || reason, promise });
});