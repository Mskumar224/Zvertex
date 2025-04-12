const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/job');
const zgptRoutes = require('./routes/zgpt');
const User = require('./models/User');
const axios = require('axios');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/zgpt', zgptRoutes);
app.use('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  try {
    // Simulate sending contact message (e.g., save to DB or send email)
    res.json({ msg: 'Message received' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Auto-apply jobs for users with resumes
cron.schedule('0 0 * * *', async () => {
  try {
    const users = await User.find({ resume: { $ne: null } });
    for (const user of users) {
      const technologies = JSON.parse(user.technologies || '[]');
      for (const tech of technologies) {
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/jobs/fetch`,
          { technology: tech, location: '' },
          { headers: { 'x-auth-token': '' } }
        );
        const jobs = res.data.jobs.slice(0, 5);
        for (const job of jobs) {
          const alreadyApplied = user.appliedJobs.some((j) => j.jobId === job.id);
          if (!alreadyApplied) {
            user.appliedJobs.push({
              jobId: job.id,
              technology: tech,
              jobTitle: job.title,
              company: job.company,
            });
          }
        }
      }
      await user.save();
    }
    console.log('Auto-apply completed');
  } catch (err) {
    console.error('Auto-apply error:', err);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));