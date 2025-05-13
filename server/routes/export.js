const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

router.get('/export-dashboard/:userId', async (req, res) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.id || decoded.id !== req.params.userId) {
      throw new Error('Unauthorized access');
    }
    const user = await User.findById(req.params.userId)
      .populate('profiles', 'name email extractedTech extractedRole')
      .populate('recruiters', 'name email')
      .populate('jobsApplied', 'title company location');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const dashboardData = {
      name: user.name,
      email: user.email,
      subscription: user.subscription,
      selectedTechnology: user.selectedTechnology,
      selectedCompanies: user.selectedCompanies,
      jobsApplied: user.jobsApplied,
      profiles: user.profiles,
      recruiters: user.recruiters,
      resumes: user.resumes
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=dashboard_export.json');
    res.send(JSON.stringify(dashboardData, null, 2));
  } catch (error) {
    console.error('Export dashboard error:', error.message, error);
    res.status(500).json({ message: 'Failed to export dashboard', error: error.message });
  }
});

module.exports = router;