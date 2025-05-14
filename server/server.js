const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/job');
require('./models/User');
require('./models/Profile');
require('./models/Job');
require('./models/Recruiter');
require('dotenv').config();

const app = express();

// Explicit CORS middleware with detailed logging
app.use((req, res, next) => {
  const origin = req.headers.origin || '*';
  console.log(`[${new Date().toISOString()}] Handling ${req.method} request for ${req.url} from origin: ${origin}`);
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    console.log(`[${new Date().toISOString()}] Responding to preflight OPTIONS request with 204`);
    return res.status(204).end();
  }
  next();
});

// Additional CORS middleware for redundancy
app.use(cors({
  origin: ['https://zvertexai.com', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log registered models
console.log('Models registered:', mongoose.modelNames());

// Connect to MongoDB with error handling
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log(`[${new Date().toISOString()}] MongoDB connected successfully`);
}).catch(err => {
  console.error(`[${new Date().toISOString()}] MongoDB connection error:`, err.message);
  process.exit(1); // Exit if MongoDB connection fails
});

// Routes
console.log(`[${new Date().toISOString()}] Setting up routes...`);
app.use('/api/auth', authRoutes);
app.use('/api/job', jobRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  console.log(`[${new Date().toISOString()}] Health check requested`);
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Server error:`, err.message);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[${new Date().toISOString()}] Server running on port ${PORT}`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`[${new Date().toISOString()}] Uncaught Exception:`, err.message);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`[${new Date().toISOString()}] Unhandled Rejection:`, err.message);
  process.exit(1);
});