const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const axios = require('axios');

// @route   GET api/jobs
// @desc    Get job matches from Arbeitnow API
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { search, location, job_type, limit } = req.query;
    let apiUrl = 'https://api.arbeitnow.com/api/job-board/v1/jobs';
    const params = {};

    if (search) params.q = search.trim();
    if (location) {
      // Normalize common abbreviations
      const loc = location.trim().toLowerCase();
      params.location = loc === 'ca' ? 'California' : loc;
    }
    if (job_type) params.job_types = job_type.trim().toLowerCase(); // Arbeitnow expects job_types
    if (limit) params.per_page = parseInt(limit) || 10;

    console.log(`Fetching jobs with params: ${JSON.stringify(params)}`);

    const response = await axios.get(apiUrl, {
      params,
      timeout: 5000,
    });

    const jobs = response.data.data && Array.isArray(response.data.data)
      ? response.data.data.map(job => ({
          _id: job.slug || `job-${Date.now()}-${Math.random()}`, // Fallback ID
          title: job.title || 'Untitled Job',
          company: job.company_name || 'Unknown Company',
          location: job.location || 'Unknown Location',
          salary: job.salary || null,
          type: job.job_types?.join(', ') || 'Not specified',
          experienceLevel: job.experience_level || 'Not specified',
          applicationUrl: job.url || '#',
          createdAt: job.created_at ? new Date(job.created_at * 1000) : new Date(),
        }))
      : [];

    if (jobs.length === 0) {
      console.log('No jobs found for params:', params);
      return res.json({ jobs, msg: 'No jobs matched your criteria' });
    }

    res.json({ jobs });
  } catch (err) {
    console.error(`Arbeitnow API error: ${err.message}`, {
      status: err.response?.status,
      data: err.response?.data,
      params: req.query,
    });
    if (err.response) {
      res.status(502).json({ msg: `Job API error: ${err.response.data?.message || 'Invalid response'}` });
    } else if (err.request) {
      res.status(503).json({ msg: 'Unable to reach job API' });
    } else {
      res.status(500).json({ msg: 'Error processing job request' });
    }
  }
});

// @route   POST api/jobs/apply
// @desc    Apply to a job (returns application URL)
// @access  Private
router.post('/apply', auth, async (req, res) => {
  const { jobId } = req.body;

  try {
    const response = await axios.get(`https://api.arbeitnow.com/api/job-board/v1/jobs/${jobId}`);
    const job = response.data.data;
    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    res.json({ msg: 'Application ready', applicationUrl: job.url });
  } catch (err) {
    console.error('Apply error:', err.message);
    res.status(500).json({ msg: 'Failed to apply' });
  }
});

module.exports = router;