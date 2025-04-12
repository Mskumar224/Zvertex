const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
require('dotenv').config();

router.post('/fetch', async (req, res) => {
  const { technology, location } = req.body;

  try {
    const response = await axios.get('http://api.adzuna.com/v1/api/jobs/us/search/1', {
      params: {
        app_id: process.env.ADZUNA_APP_ID,
        app_key: process.env.ADZUNA_APP_KEY,
        what: technology || 'software engineer',
        where: location || '',
        results_per_page: 10,
      },
    });

    const jobs = response.data.results.map(job => ({
      id: job.id,
      title: job.title,
      company: job.company.display_name,
      location: job.location.display_name,
      description: job.description,
    }));

    res.json({ jobs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to fetch jobs' });
  }
});

router.post('/resume-upload', authMiddleware, async (req, res) => {
  const { phone, technologies, companies } = req.body;
  let resume = req.files?.resume;

  try {
    if (!resume || resume.mimetype !== 'application/pdf') {
      return res.status(400).json({ msg: 'Please upload a PDF resume' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Simulate resume parsing
    user.resume = resume.name;
    user.phone = phone;
    user.technologies = technologies;
    user.companies = companies;
    await user.save();

    // Trigger auto-apply (simplified)
    const jobs = [];
    for (const tech of JSON.parse(technologies)) {
      const response = await axios.get('http://api.adzuna.com/v1/api/jobs/us/search/1', {
        params: {
          app_id: process.env.ADZUNA_APP_ID,
          app_key: process.env.ADZUNA_APP_KEY,
          what: tech,
          results_per_page: 5,
        },
      });
      response.data.results.forEach(job => {
        if (!user.appliedJobs.some(j => j.jobId === job.id)) {
          user.appliedJobs.push({
            jobId: job.id,
            technology: tech,
            jobTitle: job.title,
            company: job.company.display_name,
          });
          jobs.push(job);
        }
      });
    }
    await user.save();

    res.json({ msg: 'Resume uploaded and jobs applied', resume: resume.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/applied', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json({ appliedJobs: user.appliedJobs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;