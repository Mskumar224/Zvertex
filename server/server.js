const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/job');
const cron = require('node-cron');
const User = require('./models/User');
const axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Enhanced CORS configuration
const corsOptions = {
  origin: ['https://zvertexai.com', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-auth-token'],
  credentials: true,
  optionsSuccessStatus: 200, // Ensure OPTIONS requests return 200
};
app.use(cors(corsOptions));

// Handle OPTIONS preflight requests explicitly
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection with error handling
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);

// Auto-apply every 30 minutes
cron.schedule('*/30 * * * *', async () => {
  console.log('Running auto-apply job...');
  const users = await User.find({ paid: true });
  for (const user of users) {
    if (!user.resume || !user.phone) continue;
    const technology = user.appliedJobs[0]?.technology || 'JavaScript';
    const companies = ['Google', 'Microsoft', 'Amazon', 'Tesla', 'Apple'];
    try {
      const res = await axios.post(`${process.env.API_URL || 'https://zvertexai-orzv.onrender.com'}/api/jobs/fetch`, 
        { technology, companies },
        { headers: { 'x-auth-token': jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' }) } }
      );
      const job = res.data.jobs[Math.floor(Math.random() * res.data.jobs.length)];
      await axios.post(`${process.env.API_URL || 'https://zvertexai-orzv.onrender.com'}/api/jobs/apply`, 
        { jobId: job.id, technology, userDetails: { email: user.email, phone: user.phone } },
        { headers: { 'x-auth-token': jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' }) } }
      );
      console.log(`Auto-applied ${user.email} to ${job.id} at ${job.company}`);
    } catch (err) {
      console.error('Auto-Apply Error:', err);
    }
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));