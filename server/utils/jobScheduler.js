const cron = require('node-cron');
const User = require('../models/User');
const { fetchJobs } = require('./jobFetcher');
const { autoApplyJobs } = require('./jobMatcher');
const { sendEmail } = require('./email');

const scheduleJobApplications = () => {
  cron.schedule('* * * * *', async () => {
    try {
      console.log('Running job application scheduler');
      const users = await User.find({ resumeText: { $exists: true, $ne: null } });

      for (const user of users) {
        const lastApplied = user.lastJobApplication || new Date(0);
        const secondsSinceLast = (Date.now() - lastApplied.getTime()) / 1000;

        if (secondsSinceLast < 3600) {
          continue;
        }

        const jobs = await fetchJobs(user.jobPreferences);
        if (jobs.length < 2) {
          console.log('Not enough jobs to apply for:', { userId: user._id, jobCount: jobs.length });
          continue;
        }

        const shuffledJobs = jobs.sort(() => 0.5 - Math.random());
        const jobsToApply = shuffledJobs.slice(0, Math.max(2, Math.floor(shuffledJobs.length * 0.5)));

        const appliedJobs = await autoApplyJobs(user.resumeText, jobsToApply, user);

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