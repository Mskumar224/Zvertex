const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const ExcelJS = require('exceljs');

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
      .populate('jobsApplied', 'title company location jobLink');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Create Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Dashboard');

    // Define columns
    worksheet.columns = [
      { header: 'User Name', key: 'userName', width: 20 },
      { header: 'User Email', key: 'userEmail', width: 30 },
      { header: 'User Phone', key: 'userPhone', width: 15 },
      { header: 'Subscription', key: 'subscription', width: 15 },
      { header: 'Job Title', key: 'jobTitle', width: 30 },
      { header: 'Company', key: 'company', width: 20 },
      { header: 'Location', key: 'location', width: 20 },
      { header: 'Job Link', key: 'jobLink', width: 50 },
      { header: 'Profile Tech', key: 'profileTech', width: 20 },
      { header: 'Profile Role', key: 'profileRole', width: 20 },
      { header: 'Recruiter Name', key: 'recruiterName', width: 20 },
      { header: 'Recruiter Email', key: 'recruiterEmail', width: 30 }
    ];

    // Add data
    user.jobsApplied.forEach(job => {
      worksheet.addRow({
        userName: user.name,
        userEmail: user.email,
        userPhone: user.phone,
        subscription: user.subscription,
        jobTitle: job.title,
        company: job.company,
        location: job.location,
        jobLink: job.jobLink,
        profileTech: user.profiles.map(p => p.extractedTech).join(', '),
        profileRole: user.profiles.map(p => p.extractedRole).join(', '),
        recruiterName: user.recruiters.map(r => r.name).join(', '),
        recruiterEmail: user.recruiters.map(r => r.email).join(', ')
      });
    });

    // Set headers for Excel download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=dashboard_export.xlsx');

    // Write to response
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Export dashboard error:', error.message, error);
    res.status(500).json({ message: 'Failed to export dashboard', error: error.message });
  }
});

module.exports = router;