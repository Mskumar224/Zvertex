const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: './uploads/resumes/',
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

router.post('/search', async (req, res) => {
  const { technology, location } = req.body;
  // Placeholder for job search logic
  const jobs = [
    { id: '1', title: `${technology} Developer`, company: 'TechCorp', location: location || 'Remote' },
    { id: '2', title: `Senior ${technology} Engineer`, company: 'InnoTech', location: location || 'Remote' },
  ];
  res.json({ jobs });
});

router.get('/:jobId', async (req, res) => {
  // Placeholder for job details
  const job = {
    id: req.params.jobId,
    title: 'Software Engineer',
    company: 'TechCorp',
    location: 'Remote',
    description: 'Develop and maintain web applications using modern technologies.',
  };
  res.json({ job });
});

router.post('/apply', auth, upload.single('resume'), async (req, res) => {
  try {
    const { jobId, jobTitle, company } = req.body;
    const user = await User.findById(req.user.id);
    user.appliedJobs.push({ jobId, jobTitle, company });
    user.resume = req.file.path;
    await user.save();
    res.json({ msg: 'Application submitted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/applied', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ jobs: user.appliedJobs });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/technologies', async (req, res) => {
  // Placeholder for technologies
  res.json({ technologies: ['JavaScript', 'Python', 'Java', 'React', 'Node.js'] });
});

router.get('/companies', async (req, res) => {
  // Placeholder for companies
  res.json({ companies: ['TechCorp', 'InnoTech', 'DataWave'] });
});

module.exports = router;