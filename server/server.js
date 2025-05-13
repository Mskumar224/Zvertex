const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/job');
require('./models/Profile');
require('./models/Recruiter');
require('./models/Job');
require('dotenv').config();

const app = express();

// Configure CORS
app.use(cors({
  origin: 'https://zvertexai.com',
  methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Explicitly handle OPTIONS for all routes
app.options('*', cors({
  origin: 'https://zvertexai.com',
  methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });
app.use('/api/job', upload.single('resume'), jobRoutes);
app.use('/api/auth', authRoutes);

// Log requests for debugging
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url} - Headers: ${JSON.stringify(req.headers)}`);
  res.on('finish', () => {
    console.log(`Response [${res.statusCode}] Headers: ${JSON.stringify(res.getHeaders())}`);
  });
  next();
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));