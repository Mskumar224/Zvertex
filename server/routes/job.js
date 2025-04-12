const express = require('express');
const router = express.Router();
let authMiddleware;
try {
  authMiddleware = require('../middleware/auth');
  console.log('authMiddleware loaded successfully');
} catch (err) {
  console.error('Failed to load authMiddleware:', err.message);
}
let User;
try {
  User = require('../models/User');
  console.log('User model loaded successfully');
} catch (err) {
  console.error('Failed to load User model:', err.message);
}

console.log('Initializing jobs routes...');

router.post('/fetch', async (req, res) => {
  const { technology, location } = req.body;
  try {
    console.log('Fetching jobs for:', { technology, location });
    const mockJobs = [
      { id: '1', title: `${technology} Developer`, company: 'TechCorp', location, description: 'Develop cool stuff.' },
      { id: '2', title: `${technology} Engineer`, company: 'InnoTech', location, description: 'Engineer awesome solutions.' }
    ];
    res.json({ jobs: mockJobs });
  } catch (err) {
    console.error('Error fetching jobs:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/:jobId', async (req, res) => {
  try {
    console.log('Fetching job ID:', req.params.jobId);
    const mockJob = { id: req.params.jobId, title: 'Sample Job', company: 'SampleCorp', location: 'Remote', description: 'Sample job description.' };
    res.json({ job: mockJob });
  } catch (err) {
    console.error('Error fetching job:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/apply', authMiddleware, async (req, res) => {
  try {
    console.log('Job application attempt for user:', req.user?.id);
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    if (!req.files || !req.files.resume) {
      console.log('No resume file provided');
      return res.status(400).json({ msg: 'Please upload a resume file.' });
    }

    const { jobId, jobTitle, company } = req.body;
    console.log('Applying to job:', { jobId, jobTitle, company });
    user.appliedJobs.push({ jobId, jobTitle, company, date: new Date() });
    await user.save();

    res.json({ msg: 'Application submitted successfully' });
  } catch (err) {
    console.error('Error applying to job:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/applied', (req, res) => {
  console.log('Reached /api/jobs/applied handler');
  try {
    // Temporary mock response to confirm endpoint
    console.log('Returning mock applied jobs');
    res.json({ jobs: [] });
    /*
    // Re-enable after testing
    authMiddleware(req, res, async () => {
      console.log('Processing /api/jobs/applied for user:', req.user?.id);
      if (!User) {
        console.error('User model not available');
        return res.status(500).json({ msg: 'Server configuration error' });
      }
      const user = await User.findById(req.user.id);
      if (!user) {
        console.log('User not found:', req.user.id);
        return res.status(404).json({ msg: 'User not found' });
      }
      console.log('Returning applied jobs:', user.appliedJobs || []);
      res.json({ jobs: user.appliedJobs || [] });
    });
    */
  } catch (err) {
    console.error('Error in /api/jobs/applied:', err.message, err.stack);
    res.status(500).json({ msg: 'Server error' });
  }
});

console.log('Jobs routes defined:', router.stack.map(r => r.route?.path).filter(Boolean));

module.exports = router;