const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/job');
const exportRoutes = require('./routes/export');
const cronJobs = require('./cronJobs');
// Ensure models are registered before routes
require('./models/User');
require('./models/Profile');
require('./models/Recruiter');
require('./models/Job');
require('dotenv').config();

const app = express();

// Configure CORS with explicit headers
app.use(cors({
  origin: ['https://zvertexai.com', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400
}));

// Log requests and responses
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url} - Headers: ${JSON.stringify(req.headers)}`);
  res.on('finish', () => {
    console.log(`Response [${res.statusCode}] Headers: ${JSON.stringify(res.getHeaders())}`);
  });
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });
app.use('/api/job', upload.single('resume'), jobRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/job', exportRoutes);

// Health check endpoint
app.get('/ping', (req, res) => {
  res.status(200).json({ status: 'alive' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.message, err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
  cronJobs.startAutoApply(); // Start cron jobs after MongoDB connection
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1); // Exit on MongoDB connection failure
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));