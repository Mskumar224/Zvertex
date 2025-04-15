const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const jobsRoutes = require('./routes/jobs');
const subscriptionRoutes = require('./routes/subscription');
const zgptRoutes = require('./routes/zgpt');

dotenv.config();

const app = express();

// CORS configuration
const allowedOrigins = ['https://zvertexai.com', 'http://localhost:3000'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-auth-token'],
  credentials: true,
}));

// Log all requests and responses
app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.url} from Origin: ${req.headers.origin}`);
  res.on('finish', () => {
    console.log(`Response: ${res.statusCode} Headers: Access-Control-Allow-Origin=${res.get('Access-Control-Allow-Origin')}`);
  });
  next();
});

// Handle preflight OPTIONS requests
app.options('*', (req, res) => {
  res.set({
    'Access-Control-Allow-Origin': allowedOrigins.includes(req.headers.origin) ? req.headers.origin : 'https://zvertexai.com',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,x-auth-token',
    'Access-Control-Max-Age': 86400,
  });
  res.sendStatus(204);
});

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/zgpt', zgptRoutes);

// Error handling for 401
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    console.error(`401 Error: Invalid token for ${req.url}`);
    res.status(401).json({ msg: 'Invalid or missing token' });
  } else {
    next(err);
  }
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));