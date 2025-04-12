const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth');
const cron = require('node-cron');
const User = require('../models/User');

router.post('/fetch', async (req, res) => {
  const { technology, location } = req.body;
  try {
    const appId = process.env.ADZUNA_APP_ID;
    const appKey = process.env.ADZUNA_APP_KEY;
    const response = await axios.get('https://api.adzuna.com/v1/api/jobs/us/search/1', {
      params: {
        app_id: appId,
        app_key: appKey,
        what: technology || 'software developer',
        where: location || 'United States',
        max_days_old: 30,
      },
    });
    res.json({ jobs: response.data.results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Failed to fetch jobs' });
  }
});

router.post('/apply', auth, async (req, res) => {
  const { jobId, jobUrl } = req.body;
  try {
    const user = await User.findById(req.user.id);
    user.jobApplications.push({ jobId, jobUrl, appliedAt: new Date() });
    await user.save();
    res.json({ msg: 'Application submitted' });
  } catch (error) {
    res.status(500).json({ msg: 'Failed to apply' });
  }
});

cron.schedule('*/30 * * * *', async () => {
  try {
    const users = await User.find({ subscriptionStatus: { $in: ['active', 'trialing'] } });
    for (const user of users) {
      const response = await axios.get('https://api.adzuna.com/v1/api/jobs/us/search/1', {
        params: {
          app_id: process.env.ADZUNA_APP_ID,
          app_key: process.env.ADZUNA_APP_KEY,
          what: user.preferredTechnology || 'software developer',
          where: user.preferredLocation || 'United States',
        },
      });
      for (const job of response.data.results) {
        if (!user.jobApplications.some((app) => app.jobId === job.id)) {
          user.jobApplications.push({ jobId: job.id, jobUrl: job.redirect_url, appliedAt: new Date() });
        }
      }
      await user.save();
    }
  } catch (error) {
    console.error('Cron job error:', error);
  }
});

module.exports = router;