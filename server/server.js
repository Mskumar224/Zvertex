require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const authRoutes = require('./routes/auth');
const subscriptionRoutes = require('./routes/subscription');
const jobRoutes = require('./routes/job');
const zohaRoutes = require('./routes/zoha');
const { scheduleDailyEmails } = require('./utils/dailyEmail');
const { scheduleRecurringJobs } = require('./utils/recurringJobs');

const app = express();

// Simplified CORS configuration to handle preflight requests
app.use(cors({
  origin: ['http://localhost:3000', 'https://zvertexai.netlify.app', 'https://67e8bc6ae03cdd0008a0a23d--zvertexagi.netlify.app', 'https://zvertexai.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204
}));

// Handle preflight OPTIONS requests explicitly
app.options('*', cors());

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url} from ${req.headers.origin || 'no-origin'}`);
  next();
});

// Enhanced error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

app.use(express.json());
app.use(fileUpload());

app.get('/', (req, res) => {
  res.status(200).json({ message: 'ZvertexAI API Server' });
});

app.use('/api/auth', authRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/job', jobRoutes);
app.use('/api/zoha', zohaRoutes);

app.get('/test', (req, res) => res.send('Server is alive'));
app.get('/health', (req, res) => res.status(200).send('OK'));

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

mongoose.connection.on('connected', () => {
  scheduleDailyEmails();
  scheduleRecurringJobs();
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));

// Keep-alive to prevent Render free tier timeout
setInterval(() => {
  console.log('Keeping ZvertexAI server alive...');
}, 300000);