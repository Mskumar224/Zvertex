const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const cron = require('node-cron');
const axios = require('axios');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/job');
const zgptRoutes = require('./routes/zgpt');
const resumeRoutes = require('./routes/resume');
const User = require('./models/User');
const { autoApplyJobs } = require('./utils/automation');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/zgpt', zgptRoutes);
app.use('/api/resume', resumeRoutes);

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Cron job for trial expirations
cron.schedule('0 0 * * *', async () => {
  try {
    const users = await User.find({ subscriptionStatus: 'TRIAL' });
    for (const user of users) {
      const trialEnd = new Date(user.trialStart);
      trialEnd.setDate(trialEnd.getDate() + 4);
      if (new Date() > trialEnd) {
        user.subscriptionStatus = 'EXPIRED';
        await user.save();
        console.log(`Trial expired for user: ${user.email}`);
      }
    }
  } catch (err) {
    console.error('Cron job error:', err.message);
  }
});

// Cron job for auto-applying jobs every 30 minutes
cron.schedule('*/30 * * * *', async () => {
  try {
    const users = await User.find({ subscriptionStatus: { $in: ['TRIAL', 'ACTIVE'] } });
    for (const user of users) {
      for (const profile of user.profiles) {
        await autoApplyJobs(user._id, profile);
      }
    }
    console.log('Auto-apply jobs completed');
  } catch (err) {
    console.error('Auto-apply cron error:', err.message);
  }
});

// Keep-alive to prevent Render from sleeping
cron.schedule('*/5 * * * *', async () => {
  try {
    const response = await axios.get(`${process.env.API_URL}/health`);
    console.log('Keep-alive ping successful:', response.data);
  } catch (err) {
    console.error('Keep-alive error:', err.message);
  }
});

// Serve client build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// Start server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));