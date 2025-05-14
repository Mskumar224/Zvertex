const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/job');
// Explicitly require all models to ensure they're registered
require('./models/User');
require('./models/Profile');
require('./models/Job');
require('./models/Recruiter');
require('dotenv').config();

const app = express();

// Configure CORS to allow requests from the client origin
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

// Log to confirm models are loaded
console.log('Models registered:', mongoose.modelNames());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Log to confirm routes are being set up
console.log('Setting up routes...');
app.use('/api/auth', authRoutes);
app.use('/api/job', jobRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));