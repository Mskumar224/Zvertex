const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
require('dotenv').config();

const app = express();

// Define allowed origins
const allowedOrigins = [
  'http://localhost:3000', // Development frontend
  'https://zvertexai.com', // Production frontend
];

// Configure CORS
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., Postman, cURL)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'x-auth-token'],
    credentials: true,
  })
);

// Handle preflight OPTIONS requests globally
app.options('*', cors());

app.use(express.json());
app.use('/uploads/resumes', express.static(path.join(__dirname, 'Uploads/resumes')));

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  // Placeholder for email sending logic
  console.log('Contact form submission:', { name, email, message });
  res.json({ msg: 'Message sent successfully' });
});

app.post('/api/zgpt', async (req, res) => {
  const { query } = req.body;
  // Placeholder for ZGPT logic
  res.json({ response: `ZGPT response to: ${query}` });
});

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));