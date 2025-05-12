require('dotenv').config();
console.log('Environment Variables Loaded:');
console.log('MONGO_URI:', process.env.MONGO_URI || 'Not set');
console.log('PORT:', process.env.PORT || 'Not set');
console.log('EMAIL_USER:', process.env.EMAIL_USER || 'Not set');
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set' : 'Not set');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/job');
const { scheduleDailyEmails } = require('./utils/dailyEmail');

const app = express();

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'https://zvertexai.com', // Production frontend
      'https://67e23ab86a51458e138e0032--zvertexagi.netlify.app', // Netlify subdomains
      'https://67e2641113aab6f39709cd06--zvertexagi.netlify.app',
      'https://67e34047bb1fc30008a62bbb--zvertexagi.netlify.app',
      'http://localhost:3000', // Local development
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin || '*'); // Return specific origin or '*' for non-browser requests
    } else {
      console.error(`CORS blocked for origin: ${origin}`);
      callback(new Error(`CORS policy: ${origin} not allowed`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200,
};

// Log CORS requests and response headers for debugging
app.use((req, res, next) => {
  console.log(`[CORS] ${req.method} ${req.url} from origin: ${req.headers.origin}`);
  res.on('finish', () => {
    console.log(`[CORS] Response status: ${res.statusCode}, Headers: ${JSON.stringify(res.getHeaders())}`);
  });
  next();
});

// Apply CORS middleware early to handle preflight requests
app.use(cors(corsOptions));
app.options('*', (req, res) => {
  res.status(200).send(); // Explicitly handle OPTIONS requests
});

// Error handling middleware to catch server errors
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.url}: ${err.message}`);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

app.use(express.json({ limit: '10mb' })); // Increase payload limit for file uploads
app.use(fileUpload());

app.use('/api/auth', authRoutes);
app.use('/api/job', jobRoutes);

app.get('/test', (req, res) => res.send('Server is alive'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', uptime: process.uptime() });
});

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error('MONGO_URI is not defined. Please set it in environment variables.');
  process.exit(1);
}

mongoose.set('strictQuery', true);
mongoose
  .connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

scheduleDailyEmails();

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message);
  process.exit(1);
});