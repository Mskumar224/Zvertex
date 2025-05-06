const cron = require('node-cron');
const User = require('../models/User');
const { fetchJobs } = require('./jobFetcher');
const { autoApplyJobs } = require('./jobMatcher');
const { sendEmail } = require('./email');

const scheduleJobApplications = () => {
  // Run every minute to check for users
  cron.schedule('* * * * *', async () => {
    try {
      console.log('Running job application scheduler');
      const users = await User.find({ resumeText: { $exists: true, $ne: null } });

      for (const user of users) {
        // Random interval between 30-45 minutes (in seconds)
        const lastApplied = user.lastJobApplication || new Date(0);
        const intervalSeconds = Math.floor(Math.random() * (45 - 30 + 1) + 30) * 60;
        const secondsSinceLast = (Date.now() - lastApplied.getTime()) / 1000;

        if (secondsSinceLast < intervalSeconds) {
          continue;
        }

        const jobs = await fetchJobs();
        const appliedJobs = await autoApplyJobs(user.resumeText, jobs, user);

        if (appliedJobs.length > 0) {
          try {
            await sendEmail(
              user.email,
              'ZvertexAI Job Application Confirmation',
              `
                <p>Dear ${user.email},</p>
                <p>We have successfully applied to ${appliedJobs.length} new job opportunities on your behalf based on your resume.</p>
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
            user.lastJobApplication = new Date();
            await user.save();
            console.log('Sent periodic job application email:', { userId: user._id, appliedJobs: appliedJobs.length });
          } catch (emailError) {
            console.error('Failed to send periodic job application email:', emailError.message);
          }
        }
      }
    } catch (error) {
      console.error('Job scheduler error:', error.message);
    }
  });
};

module.exports = { scheduleJobApplications };