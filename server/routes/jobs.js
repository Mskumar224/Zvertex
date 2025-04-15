const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const axios = require('axios');

// Fallback jobs
const fallbackJobs = [
  {
    _id: `job-fallback-1`,
    title: 'Software Engineer',
    company: 'Tech Corp',
    location: 'Remote',
    salary: null,
    type: 'Full-time',
    experienceLevel: 'Mid-level',
    applicationUrl: '#',
    createdAt: new Date(),
  },
  {
    _id: `job-fallback-2`,
    title: 'Data Analyst',
    company: 'Data Inc',
    location: 'New York',
    salary: null,
    type: 'Part-time',
    experienceLevel: 'Entry-level',
    applicationUrl: '#',
    createdAt: new Date(),
  },
];

const fetchWithRetry = async (url, options, retries = 3, delay = 2000) => {
  for (let i = 0; i <= retries; i++) {
    try {
      return await axios.get(url, options);
    } catch (err) {
      if (i === retries || (err.response && err.response.status < 500)) throw err;
      console.log(`Retry ${i + 1}/${retries} for ${url}: ${err.message}`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// @route   GET api/jobs
// @desc    Get job matches from Arbeitnow API
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { search, location, job_type, limit } = req.query;
    const params = {};

    if (search && search.trim()) params.q = search.trim();
    if (location && location.trim()) {
      const loc = location.trim().toLowerCase();
      params.location = loc === 'ca' ? 'California' : loc;
    }
    if (job_type && job_type.trim()) {
      const validTypes = ['full-time', 'part-time', 'contract', 'internship'];
      if (validTypes.includes(job_type.toLowerCase())) {
        params.job_types = job_type.toLowerCase();
      }
    }
    if (limit) params.per_page = parseInt(limit) || 10;

    if (!params.q && !params.location && !params.job_types) {
      console.log('Empty query, returning fallback');
      return res.status(200).json({ jobs: fallbackJobs, msg: 'Enter search criteria to find jobs' });
    }

    console.log(`Fetching jobs: ${JSON.stringify(params)}`);

    const apiUrl = 'https://api.arbeitnow.com/api/job-board/v1/jobs';
    const response = await fetchWithRetry(apiUrl, {
      params,
      timeout: 5000,
    });

    const jobs = response.data.data && Array.isArray(response.data.data)
      ? response.data.data.map(job => ({
          _id: job.slug || `job-${Date.now()}-${Math.random()}`,
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

    res.status(200).json({ jobs, msg: jobs.length === 0 ? 'No jobs matched your criteria' : undefined });
  } catch (err) {
    console.error(`Arbeitnow API error: ${err.message}`, {
      status: err.response?.status,
      data: err.response?.data,
      params: req.query,
    });
    let status = 503;
    let msg = 'Unable to reach job API. Showing sample jobs.';
    if (err.code === 'ENOTFOUND') {
      msg = 'Job API unavailable (DNS error). Showing sample jobs.';
    } else if (err.response?.status === 429) {
      status = 429;
      msg = 'Rate limit exceeded. Please try again later.';
    } else if (err.response) {
      status = 502;
      msg = `Job API error: ${err.response.data?.message || 'Invalid response'}`;
    }
    res.status(status).json({ msg, jobs: fallbackJobs });
  }
});

// @route   POST api/jobs/apply
// @desc    Apply to a job
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