const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/job');
require('./models/User');
require('./models/Profile');
require('./models/Recruiter');
require('./models/Job');
require('dotenv').config();

const app = express();

// Configure CORS with explicit headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://zvertexai.com');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Max-Age', '86400');
  if (req.method === 'OPTIONS') {
    return res.status(204).send();
  }
  next();
});

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

// Health check endpoint
app.get('/ping', (req, res) => res.json({ status: 'alive' }));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));