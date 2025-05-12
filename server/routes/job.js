const express = require('express');
const router = express.Router();
const { parseResume } = require('../utils/resumeParser');
const { fetchJobs } = require('../utils/jobFetcher');
const { autoApplyJobs } = require('../utils/jobMatcher');
const { sendEmail } = require('../utils/email');
const Job = require('../models/Job');
const User = require('../models/User');
const verifyToken = require('../middleware/auth');

router.post('/set-preferences', verifyToken, async (req, res) => {
  const { jobType, locationZip, jobPosition } = req.body;

  if (!jobType || !locationZip || !jobPosition) {
    console.error('Set preferences failed: Missing required fields', { userId: req.userId });
    return res.status(400).json({ error: 'Job type, location zip code, and job position are required' });
  }

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      console.error('Set preferences failed: User not found', { userId: req.userId });
      return res.status(404).json({ error: 'User not found' });
    }

    user.jobPreferences = { jobType, locationZip, jobPosition };
    await user.save();

    res.json({ message: 'Job preferences saved successfully.' });
  } catch (error) {
    console.error('Set preferences error:', error.message);
    res.status(500).json({ error: 'Server error during setting preferences' });
  }
});

router.post('/upload-resume', verifyToken, async (req, res) => {
  console.log('Upload resume request:', { userId: req.userId });
  if (!req.files || !req.files.resume) {
    console.error('Resume upload failed: No file uploaded');
    return res.status(400).json({ error: 'No resume file uploaded' });
  }

  const resume = req.files.resume;
  console.log('Resume file received:', { name: resume.name, size: resume.size });

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      console.error('Resume upload failed: User not found', { userId: req.userId });
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.jobPreferences?.jobType || !user.jobPreferences?.locationZip || !user.jobPreferences?.jobPosition) {
      console.error('Resume upload failed: Job preferences not set', { userId: req.userId });
      return res.status(400).json({ error: 'Please set job preferences before uploading a resume.', redirect: '/job-preferences' });
    }

    const parsedData = await parseResume(resume);
    user.resumeText = parsedData.text;
    await user.save();

    if (user.firstResumeUpload) {
      try {
        await sendEmail(
          user.email,
          'ZvertexAI Resume Upload Confirmation',
          `
            <p>Dear ${user.email},</p>
            <p>Your resume has been successfully uploaded to ZvertexAI for the first time.</p>
            <p><span class="highlight">Upload Details:</span></p>
            <p>File Name: ${resume.name}</p>
            <p>Time: {{formattedDate}}</p>
            <p>We will now process your resume to find and apply to suitable job opportunities based on your preferences.</p>
            <p>Best regards,<br>ZvertexAI Team</p>
          `,
          user.timeZone
        );
        user.firstResumeUpload = false;
        await user.save();
      } catch (emailError) {
        console.error('Failed to send resume upload email:', emailError.message);
      }
    }

    const jobs = await fetchJobs(user.jobPreferences);
    const appliedJobs = await autoApplyJobs(parsedData.text, jobs, user);

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
              <p>Job ID: ${job.jobId}</p>
              <p>Job Title: ${job.title}</p>
              <p>Company: ${job.company}</p>
              <p>Location: ${job.location}</p>
              <p>Applied On: {{formattedDate}}</p>
              <hr>
            `).join('')}
            <p>You can track the status of these applications in your ZvertexAI dashboard.</p>
            <p>Best regards,<br>ZvertexAI Team</p>
            <a href="https://zvertexai.com/student-dashboard" class="button">View Dashboard</a>
          `,
          user.timeZone
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
    if (error.code === 11000) {
      res.status(500).json({ error: 'Failed to process resume due to duplicate job entry. Please try again or contact support.' });
    } else {
      res.status(500).json({ error: 'Failed to process resume. Please try again.' });
    }
  }
});

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