const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const cron = require('node-cron');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/job');
const zgptRoutes = require('./routes/zgpt');
const User = require('./models/User');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/zgpt', zgptRoutes);

// Health check endpoint for Render
app.get('/health', (req, res) => res.status(200).json({ status: 'OK' }));

// MongoDB Connection
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error('MONGO_URI is not defined in environment variables');
  process.exit(1);
}

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

// Cron job to check trial expirations
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

// Serve client build in production
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '../client/build');
  app.use(express.static(clientBuildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'), (err) => {
      if (err) {
        console.error('Error serving index.html:', err.message);
        res.status(500).send('Server error');
      }
    });
  });
}

// Start server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));