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

    if (search) params.q = search;
    if (location) params.location = location;
    if (job_type) params.job_types = job_type; // Fixed: Arbeitnow uses job_types
    if (limit) params.per_page = parseInt(limit) || 10;

    console.log('Fetching jobs with params:', params); // Debug log

    const response = await axios.get(apiUrl, { 
      params,
      timeout: 5000 // Prevent hanging
    });

    if (!response.data.data) {
      console.error('Arbeitnow API returned no data');
      return res.status(502).json({ msg: 'No jobs returned from external API' });
    }

    const jobs = response.data.data.map(job => ({
      _id: job.slug,
      title: job.title,
      company: job.company_name,
      location: job.location,
      salary: job.salary || null,
      type: job.job_types?.join(', ') || 'Not specified',
      experienceLevel: job.experience_level || 'Not specified',
      applicationUrl: job.url,
      createdAt: new Date(job.created_at * 1000),
    }));

    res.json({ jobs });
  } catch (err) {
    console.error('Arbeitnow API error:', err.message, err.response?.data);
    if (err.response) {
      res.status(err.response.status).json({ 
        msg: `External API error: ${err.response.data?.message || 'Unknown error'}` 
      });
    } else if (err.request) {
      res.status(503).json({ msg: 'Failed to reach job API' });
    } else {
      res.status(500).json({ msg: 'Server error fetching jobs' });
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