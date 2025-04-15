const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Job = require('../models/Job');

// @route   GET api/jobs
// @desc    Get job matches (with optional search and limit)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { search, limit } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { company: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } },
        ],
      };
    }

    const jobs = await Job.find(query)
      .limit(parseInt(limit) || 10)
      .sort({ createdAt: -1 });

    res.json({ jobs });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/jobs/apply
// @desc    Apply to a job
// @access  Private
router.post('/apply', auth, async (req, res) => {
  const { jobId } = req.body;

  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    res.json({ msg: 'Application submitted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;