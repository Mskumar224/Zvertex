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

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:3000',
      'https://zvertexai.netlify.app',
      'https://67e8bc6ae03cdd0008a0a23d--zvertexagi.netlify.app',
      'http://zvertexai.com',
      'https://zvertexai.com',
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`CORS blocked for origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Log all requests for debugging
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url} from ${req.headers.origin || 'no-origin'}`);
  next();
});

// Handle uncaught errors to prevent 502s
app.use((err, req, res, next) => {
  console.error('Server error:', err.message); // Added for debugging
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

app.use(express.json());
app.use(fileUpload());

// Define root route to avoid 404s
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
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB error:', err.message));

// Optimize Puppeteer by running jobs only if MongoDB is connected
mongoose.connection.on('connected', () => {
  scheduleDailyEmails();
  scheduleRecurringJobs();
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));

// Keep server alive on Render
setInterval(() => {
  console.log('Keeping ZvertexAI server alive...');
}, 300000); // Ping every 5 minutes