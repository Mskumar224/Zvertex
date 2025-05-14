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
  console.log(`Handling ${req.method} request for ${req.url} from origin: ${req.headers.origin}`);
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    console.log('Responding to preflight OPTIONS request');
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

console.log('Models registered:', mongoose.modelNames());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

console.log('Setting up routes...');
app.use('/api/auth', authRoutes);
app.use('/api/job', jobRoutes);

app.get('/health', (req, res) => {
  console.log('Health check requested');
  res.status(200).json({ status: 'OK' });
});

app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));