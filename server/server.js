const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fileUpload = require('express-fileupload');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/job');
const resumeRoutes = require('./routes/resume');
const zgptRoutes = require('./routes/zgpt');

const app = express();

// CORS configuration
app.use(cors({
  origin: ['https://zvertexai.com', 'https://your-site-name.netlify.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'x-auth-token', 'Authorization'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));
app.options('*', cors()); // Handle preflight requests explicitly

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection with increased timeout and retry
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 30000,
    retryWrites: true,
    maxPoolSize: 10
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/job', jobRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/zgpt', zgptRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Catch-all for 404 errors
app.use((req, res, next) => {
  res.status(404).json({ msg: 'Resource not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ msg: 'Server error' });
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));