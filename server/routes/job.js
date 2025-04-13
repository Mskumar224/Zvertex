const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth');
const logger = require('winston');
const User = require('../models/User');

router.get('/search', auth, async (req, res) => {
  const { query, location } = req.query;
  try {
    if (!query || !location) {
      return res.status(400).json({ msg: 'Query and location are required' });
    }
    const response = await axios.get('https://api.adzuna.com/v1/api/jobs/us/search/1', {
      params: {
        app_id: process.env.ADZUNA_APP_ID || 'your_adzuna_app_id',
        app_key: process.env.ADZUNA_APP_KEY || 'your_adzuna_app_key',
        what: query,
        where: location,
        results_per_page: 10,
      },
    });
    res.json(response.data.results);
  } catch (err) {
    logger.error(`${new Date().toISOString()} - Job Search Error: ${err.message}`);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/apply', auth, async (req, res) => {
  const { jobId, jobTitle, company, jobUrl } = req.body;
  try {
    if (!jobId || !jobTitle || !company || !jobUrl) {
      return res.status(400).json({ msg: 'All job details are required' });
    }
    const user = await User.findById(req.user.id);
    user.jobsApplied.push({
      jobId,
      title: jobTitle,
      company,
      appliedAt: new Date(),
    });
    await user.save();
    res.json({ msg: 'Application submitted' });
  } catch (err) {
    logger.error(`${new Date().toISOString()} - Job Apply Error: ${err.message}`);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/fetch', async (req, res) => {
  const { technology, location } = req.body;
  try {
    const response = await axios.get('https://api.adzuna.com/v1/api/jobs/us/search/1', {
      params: {
        app_id: process.env.ADZUNA_APP_ID || 'your_adzuna_app_id',
        app_key: process.env.ADZUNA_APP_KEY || 'your_adzuna_app_key',
        what: technology,
        where: location,
        results_per_page: 10,
      },
    });
    res.json({ jobs: response.data.results });
  } catch (err) {
    logger.error(`${new Date().toISOString()} - Job Fetch Error: ${err.message}`);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;