require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const cron = require('node-cron');
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/job');
const zgptRoutes = require('./routes/zgpt');
const User = require('./models/User');
const { applyToJob, fetchJobs } = require('./utils/automation');
const { sendEmail } = require('./utils/email');
const path = require('path');
const fs = require('fs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/zgpt', zgptRoutes);

// Serve static files only if client/build exists
const buildPath = path.join(__dirname, '../client/build');
if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));
  // Serve frontend for non-API routes
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'), (err) => {
      if (err) {
        console.error('Error serving index.html:', err);
        res.status(500).json({ msg: 'Failed to load frontend' });
      }
    });
  });
} else {
  console.warn('client/build not found; API-only mode enabled');
}

// Connect to MongoDB
mongoose
  .connect(config.get('mongoURI'), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Auto-apply cron job (every 30 minutes)
cron.schedule('*/30 * * * *', async () => {
  console.log('Running auto-apply job...');
  try {
    const users = await User.find({
      $or: [{ subscriptionType: 'Student' }, { subscriptionType: 'Recruiter' }],
    });

    const jobs = await fetchJobs();

    for (const user of users) {
      const profiles = user.subscriptionType === 'Recruiter' ? user.profiles : [{ ...user.toObject(), id: 1 }];

      for (const profile of profiles) {
        if (!profile.technologies.length || !profile.companies.length) continue;

        for (const job of jobs) {
          if (
            profile.technologies.includes(job.technology) &&
            profile.companies.includes(job.company) &&
            !profile.appliedJobs.some((j) => j.jobId === job.jobId)
          ) {
            profile.appliedJobs.push(job);
            await applyToJob(job.jobLink, { email: user.email, phone: profile.phone });
            await sendEmail(
              user.email,
              'Auto-Apply Confirmation',
              `Applied to ${job.jobTitle} at ${job.company} for profile ${profile.id || 'Student'}. View: ${job.jobLink}`
            );
          }
        }
      }

      await user.save();
    }
    console.log('Auto-apply completed');
  } catch (err) {
    console.error('Auto-apply error:', err.message);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));