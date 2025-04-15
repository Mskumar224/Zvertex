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
    if (job_type) params.job_type = job_type;
    if (limit) params.per_page = parseInt(limit) || 10;

    const response = await axios.get(apiUrl, { params });
    const jobs = response.data.data.map(job => ({
      _id: job.slug,
      title: job.title,
      company: job.company_name,
      location: job.location,
      salary: job.salary || null,
      type: job.job_types.join(', ') || 'Not specified',
      experienceLevel: job.experience_level || 'Not specified',
      applicationUrl: job.url,
      createdAt: new Date(job.created_at * 1000),
    }));

    res.json({ jobs });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Failed to fetch jobs' });
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
    console.error(err.message);
    res.status(500).json({ msg: 'Failed to apply' });
  }
});

module.exports = router;