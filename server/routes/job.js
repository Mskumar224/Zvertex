const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth');
const User = require('../models/User');

router.post('/fetch', auth, async (req, res) => {
  const { technology, companies } = req.body;
  try {
    if (!technology) {
      return res.status(400).json({ msg: 'Technology is required' });
    }

    const appId = process.env.ADZUNA_APP_ID;
    const appKey = process.env.ADZUNA_APP_KEY;
    if (!appId || !appKey) {
      return res.status(500).json({ msg: 'Adzuna API credentials missing' });
    }

    const queryParams = new URLSearchParams({
      app_id: appId,
      app_key: appKey,
      what: technology,
      results_per_page: 10,
    });

    if (companies && Array.isArray(companies)) {
      queryParams.append('company', companies.join(','));
    }

    const url = `https://api.adzuna.com/v1/api/jobs/us/search/1?${queryParams.toString()}`;
    const response = await axios.get(url);

    const jobs = response.data.results.map(job => ({
      id: job.id,
      title: job.title,
      company: job.company.display_name,
      location: job.location.display_name,
      description: job.description,
      redirect_url: job.redirect_url,
      created: job.created,
    }));

    res.json({ jobs });
  } catch (error) {
    console.error(`${new Date().toISOString()} - Fetch Jobs Error:`, error);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/apply', auth, async (req, res) => {
  const { jobId, jobUrl, jobTitle, company } = req.body;
  try {
    if (!jobId || !jobUrl) {
      return res.status(400).json({ msg: 'Job ID and URL are required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user.jobApplications = user.jobApplications || [];
    if (user.jobApplications.some(app => app.jobId === jobId)) {
      return res.status(400).json({ msg: 'Already applied to this job' });
    }

    user.jobApplications.push({
      jobId,
      jobUrl,
      jobTitle,
      company,
      appliedAt: new Date(),
    });
    await user.save();

    res.json({ msg: 'Application submitted' });
  } catch (error) {
    console.error(`${new Date().toISOString()} - Apply Job Error:`, error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;