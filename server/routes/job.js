const express = require('express');
const router = express.Router();
const { parseResume } = require('../utils/resumeParser');
const { fetchJobs } = require('../utils/jobFetcher');
const { autoApplyJobs } = require('../utils/jobMatcher');
const { sendEmail } = require('../utils/email');
const Job = require('../models/Job');
const User = require('../models/User');
const verifyToken = require('../middleware/auth');

// Upload resume
router.post('/upload-resume', verifyToken, async (req, res) => {
  console.log('Upload resume request:', { userId: req.userId });
  if (!req.files || !req.files.resume) {
    console.error('Resume upload failed: No file uploaded');
    return res.status(400).json({ error: 'No resume file uploaded' });
  }

  const resume = req.files.resume;
  console.log('Resume file received:', { name: resume.name, size: resume.size });

  try {
    const parsedData = await parseResume(resume);
    const user = await User.findById(req.userId);
    if (!user) {
      console.error('Resume upload failed: User not found', { userId: req.userId });
      return res.status(404).json({ error: 'User not found' });
    }

    // Store resume text for periodic job matching
    user.resumeText = parsedData.text;
    await user.save();

    // Send resume upload confirmation email
    try {
      await sendEmail(
        user.email,
        'ZvertexAI Resume Upload Confirmation',
        `
          <p>Dear ${user.email},</p>
          <p>Your resume has been successfully uploaded to ZvertexAI.</p>
          <p><span class="highlight">Upload Details:</span></p>
          <p>File Name: ${resume.name}</p>
          <p>Time: ${new Date().toLocaleString()}</p>
          <p>We will now process your resume to find and apply to suitable job opportunities.</p>
          <p>Best regards,<br>ZvertexAI Team</p>
        `
      );
    } catch (emailError) {
      console.error('Failed to send resume upload email:', emailError.message);
    }

    // Fetch real-time jobs and auto-apply
    const jobs = await fetchJobs();
    const appliedJobs = await autoApplyJobs(parsedData.text, jobs, user);

    // Send job application confirmation email
    if (appliedJobs.length > 0) {
      try {
        await sendEmail(
          user.email,
          'ZvertexAI Job Application Confirmation',
          `
            <p>Dear ${user.email},</p>
            <p>We have successfully applied to ${appliedJobs.length} job opportunities on your behalf based on your resume.</p>
            <p><span class="highlight">Applied Jobs:</span></p>
            ${appliedJobs.map(job => `
              <p>Job Title: ${job.title}</p>
              <p>Company: ${job.company}</p>
              <p>Location: ${job.location}</p>
              <p>Applied On: ${new Date(job.appliedAt).toLocaleString()}</p>
              <hr>
            `).join('')}
            <p>You can track the status of these applications in your ZvertexAI dashboard.</p>
            <p>Best regards,<br>ZvertexAI Team</p>
            <a href="https://zvertexai.com/student-dashboard" class="button">View Dashboard</a>
          `
        );
      } catch (emailError) {
        console.error('Failed to send job application email:', emailError.message);
      }
    }

    console.log('Resume uploaded and processed:', { userId: req.userId, appliedJobs: appliedJobs.length });
    res.json({ 
      message: 'Resume uploaded successfully. Applied to ' + appliedJobs.length + ' jobs.', 
      data: parsedData,
      appliedJobs 
    });
  } catch (error) {
    console.error('Resume upload error:', error.message);
    res.status(500).json({ error: 'Failed to process resume. Please try again.' });
  }
});

// Job tracker
router.get('/tracker', verifyToken, async (req, res) => {
  console.log('Job tracker request:', { userId: req.userId });
  try {
    const jobs = await Job.find({ userId: req.userId });
    res.json(jobs);
  } catch (error) {
    console.error('Job tracker error:', error.message);
    res.status(500).json({ error: 'Failed to load job applications. Please try again.' });
  }
});

module.exports = router;