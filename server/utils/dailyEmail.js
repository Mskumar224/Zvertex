const cron = require('node-cron');
const User = require('../models/User');
const Job = require('../models/Job');
const { sendEmail } = require('./email');
const axios = require('axios');

async function autoApplyJobs() {
  const users = await User.find({ isVerified: true }).populate('jobsApplied');
  const intervals = [1800000, 2100000, 2400000, 2700000]; // 30-45 min intervals

  for (const user of users) {
    if (user.preferences?.companies?.length > 0 && user.submissionsToday < user.submissions) {
      for (const company of user.preferences.companies) {
        try {
          const { data } = await axios.post(
            `${process.env.REACT_APP_API_URL}/api/job/fetch-jobs`,
            { company, keywords: user.preferences.keywords || [] }
          );
          const jobs = data.jobs.filter(job => !user.jobsApplied.some(ja => ja.jobId === job.id));

          for (const job of jobs) {
            if (user.submissionsToday >= user.submissions) break;

            const newJob = new Job({
              jobId: job.id,
              title: job.title,
              company: job.company,
              link: job.link,
              applied: true,
              user: user._id,
              requiresDocs: job.requiresDocs
            });
            await newJob.save();
            user.jobsApplied.push(newJob._id);
            user.submissionsToday += 1;
            await user.save();

            const emailTemplate = `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f5f5f5; padding: 20px;">
                <div style="background-color: #1a2a44; padding: 10px; text-align: center;">
                  <h1 style="color: white; margin: 0;">ZvertexAI</h1>
                </div>
                <div style="background-color: white; padding: 20px; border-radius: 5px; margin-top: 10px;">
                  <h2 style="color: #1a2a44;">Job Application Confirmation</h2>
                  <p>Dear ${user.email},</p>
                  <p>We have successfully applied to the following job on your behalf:</p>
                  <ul>
                    <li><strong>Job Title:</strong> ${job.title}</li>
                    <li><strong>Company:</strong> ${job.company}</li>
                    <li><strong>Application Status:</strong> <a href="${job.link}" style="color: #ff6d00;">Check Status</a></li>
                  </ul>
                  <p>Thank you for choosing ZvertexAI!</p>
                  <p>Best regards,<br>ZvertexAI Team</p>
                </div>
                <div style="text-align: center; color: #757575; margin-top: 10px;">
                  <p>© 2025 ZvertexAI. All rights reserved.</p>
                </div>
              </div>
            `;
            await sendEmail(user.email, 'ZvertexAI Job Application Confirmation', emailTemplate);
            await sendEmail('zvertex.247@gmail.com', 'ZvertexAI Job Application Notification', emailTemplate);

            // Wait for a random interval
            await new Promise(resolve => setTimeout(resolve, intervals[Math.floor(Math.random() * intervals.length)]));
          }
        } catch (error) {
          console.error('Auto-apply error:', error);
        }
      }
    }

    // Reset daily submissions
    if (new Date() - new Date(user.lastReset) >= 24 * 60 * 60 * 1000) {
      user.submissionsToday = 0;
      user.lastReset = new Date();
      await user.save();
    }
  }
}

function scheduleDailyEmails() {
  // Continuous auto-apply every 30-45 minutes
  cron.schedule('*/30 * * * *', autoApplyJobs);
  // Daily summary at 8 AM
  cron.schedule('0 8 * * *', async () => {
    const users = await User.find().populate('jobsApplied');
    for (const user of users) {
      const todayJobs = user.jobsApplied.filter(job => {
        const jobDate = new Date(job.createdAt);
        const now = new Date();
        return jobDate.getDate() === now.getDate() - 1;
      });
      if (todayJobs.length > 0) {
        const emailTemplate = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f5f5f5; padding: 20px;">
            <div style="background-color: #1a2a44; padding: 10px; text-align: center;">
              <h1 style="color: white; margin: 0;">ZvertexAI</h1>
            </div>
            <div style="background-color: white; padding: 20px; border-radius: 5px; margin-top: 10px;">
              <h2 style="color: #1a2a44;">Daily Job Application Summary</h2>
              <p>Dear ${user.email},</p>
              <p>You applied to ${todayJobs.length} job(s) yesterday:</p>
              <ul>
                ${todayJobs.map(job => `
                  <li>
                    <strong>${job.title}</strong> at ${job.company}<br>
                    <a href="${job.link}" style="color: #ff6d00;">Check Status</a>
                  </li>
                `).join('')}
              </ul>
              <p>Thank you for using ZvertexAI!</p>
              <p>Best regards,<br>ZvertexAI Team</p>
            </div>
            <div style="text-align: center; color: #757575; margin-top: 10px;">
              <p>© 2025 ZvertexAI. All rights reserved.</p>
            </div>
          </div>
        `;
        await sendEmail(user.email, 'ZvertexAI Daily Job Application Summary', emailTemplate);
      }
    }
  });
}

module.exports = { scheduleDailyEmails };