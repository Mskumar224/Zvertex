const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const axios = require('axios');

// Fallback jobs (mock data for API failure)
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
      if (i === retries || err.response?.status < 500) throw err;
      console.log(`Retry ${i + 1}/${retries} for ${url}`);
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

    // Validate parameters
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

    // Skip empty queries
    if (!params.q && !params.location && !params.job_types) {
      console.log('Empty query parameters, returning fallback jobs');
      return res.json({ jobs: fallbackJobs, msg: 'Enter search criteria to find jobs' });
    }

    console.log(`Fetching jobs with params: ${JSON.stringify(params)}`);

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

    res.json({ jobs, msg: jobs.length === 0 ? 'No jobs matched your criteria' : undefined });
  } catch (err) {
    console.error(`Arbeitnow API error: ${err.message}`, {
      status: err.response?.status,
      data: err.response?.data,
      params: req.query,
    });
    if (err.response?.status === 429) {
      res.status(429).json({ msg: 'Rate limit exceeded. Please try again later.', jobs: fallbackJobs });
    } else if (err.response) {
      res.status(502).json({ msg: `Job API error: ${err.response.data?.message || 'Invalid response'}`, jobs: fallbackJobs });
    } else {
      res.status(503).json({ msg: 'Unable to reach job API. Showing sample jobs.', jobs: fallbackJobs });
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