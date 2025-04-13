const express = require('express');
const router = express.Router();
const axios = require('axios');
const config = require('config');

// Mock jobs fallback
const mockJobs = [
  {
    jobId: '1',
    jobTitle: 'Frontend Developer',
    company: 'Google',
    technology: 'React',
    jobLink: 'https://careers.google.com/jobs/123',
    date: new Date(),
  },
  {
    jobId: '2',
    jobTitle: 'Backend Engineer',
    company: 'Amazon',
    technology: 'Node.js',
    jobLink: 'https://amazon.jobs/en/jobs/456',
    date: new Date(),
  },
];

// @route   GET api/jobs
// @desc    Fetch jobs from Adzuna API or return mock jobs
// @access  Public
router.get('/', async (req, res) => {
  try {
    const appId = config.get('adzunaAppId') || '820cd31b';
    const appKey = config.get('adzunaAppKey') || 'a447ec201ccb313ff7f216ced0a3e671';
    const what = encodeURIComponent('software developer');
    const companies = ['Google', 'Meta', 'Cisco', 'Amazon', 'Microsoft', 'Apple'];
    const resultsPerPage = 10;

    // Adzuna API request
    const response = await axios.get(
      `https://api.adzuna.com/v1/api/jobs/us/search/1`,
      {
        params: {
          app_id: appId,
          app_key: appKey,
          what: what,
          results_per_page: resultsPerPage,
          // Adzuna doesn't support company filtering directly; handle in post-processing
        },
      }
    );

    let jobs = response.data.results || [];
    
    // Filter jobs by company (since API doesn't support company param)
    jobs = jobs.filter(job => companies.includes(job.company?.display_name));
    
    // Map to required format
    const formattedJobs = jobs.map(job => ({
      jobId: job.id,
      jobTitle: job.title,
      company: job.company?.display_name || 'Unknown',
      technology: job.category?.label || 'Unknown',
      jobLink: job.redirect_url || '#',
      date: new Date(job.created),
    }));

    // If no jobs, return mock jobs
    if (formattedJobs.length === 0) {
      console.warn('No jobs from Adzuna API; returning mock jobs');
      return res.json(mockJobs);
    }

    res.json(formattedJobs);
  } catch (err) {
    console.error('Job fetch error:', err.response?.data || err.message);
    // Fallback to mock jobs on error
    res.json(mockJobs);
  }
});

module.exports = router;