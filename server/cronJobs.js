const cron = require('node-cron');
const User = require('./models/User');
const Job = require('./models/Job');
const nodemailer = require('nodemailer');
const axios = require('axios');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

// Fetch real-time jobs (simulated)
const fetchRealTimeJobs = async (technology, companies) => {
  try {
    const jobs = [
      { id: `job-${Date.now()}-1`, title: `${technology} Developer`, company: companies[0] || 'Indeed', location: 'Remote', jobLink: `https://www.indeed.com/viewjob?jk=job1`, requiredFields: ['name', 'email', 'phone'] },
      { id: `job-${Date.now()}-2`, title: `Senior ${technology} Engineer`, company: companies[1] || 'LinkedIn', location: 'San Francisco', jobLink: `https://www.linkedin.com/jobs/view/job2`, requiredFields: ['name', 'email', 'linkedin'] },
      { id: `job-${Date.now()}-3`, title: `${technology} Consultant`, company: companies[2] || 'Glassdoor', location: 'New York', jobLink: `https://www.glassdoor.com/job/job3`, requiredFields: ['name', 'email', 'portfolio'] }
    ].filter(job => job.company);
    return jobs;
  } catch (error) {
    console.error('Cron fetch jobs error:', error.message);
    return [];
  }
};

// Simulated form autofill
const autofillJobForm = (job, user) => {
  const formData = {};
  job.requiredFields.forEach(field => {
    if (field === 'name') formData[field] = user.name || 'N/A';
    if (field === 'email') formData[field] = user.email || 'N/A';
    if (field === 'phone') formData[field] = user.phone || 'N/A';
    if (field === 'linkedin') formData[field] = user.linkedin || 'N/A';
    if (field === 'portfolio') formData[field] = user.portfolio || 'N/A';
  });
  return formData;
};

const startAutoApply = () => {
  // Schedule auto-apply every 30 minutes
  cron.schedule('*/30 * * * *', async () => {
    console.log('Running auto-apply cron job');
    try {
      const users = await User.find({ isVerified: true }).populate('profiles jobsApplied');
      for (const user of users) {
        const profiles = user.subscription === 'Recruiter' ? user.profiles.slice(0, 5) : user.subscription === 'Business' ? user.recruiters.slice(0, 3).map(r => r.profiles).flat() : [user];
        for (const profile of profiles) {
          const technology = user.selectedTechnology || profile.extractedTech || 'Unknown';
          const companies = user.selectedCompanies || ['Indeed', 'LinkedIn', 'Glassdoor'];

          const jobsToApply = await fetchRealTimeJobs(technology, companies);
          if (!jobsToApply.length) continue;

          const jobIds = [];
          for (const jobData of jobsToApply) {
            // Check if job already applied
            const alreadyApplied = user.jobsApplied.some(job => job.jobLink === jobData.jobLink);
            if (alreadyApplied) continue;

            const formData = autofillJobForm(jobData, user);
            console.log('Cron autofilled form for job:', jobData.id, formData);

            const job = new Job({
              title: jobData.title,
              company: jobData.company,
              location: jobData.location,
              technology,
              jobLink: jobData.jobLink,
              postedBy: user._id
            });
            await job.save();
            user.jobsApplied.push(job._id);
            jobIds.push(job._id.toString());

            // Send communication email to job poster
            await transporter.sendMail({
              from: '"ZvertexAI Team" <zvertexai@honotech.com>',
              to: `recruiter@${jobData.company.toLowerCase()}.com`,
              subject: `Application for ${jobData.title}`,
              html: `
                <div style="font-family: Roboto, Arial, sans-serif; color: #333;">
                  <h2 style="color: #1976d2;">New Application</h2>
                  <p>Applicant: ${user.name}</p>
                  <p>Email: ${user.email}</p>
                  <p>Phone: ${user.phone}</p>
                  <p>Job: ${jobData.title}</p>
                  <p>Contact the applicant for further steps.</p>
                </div>
              `
            });
          }

          if (jobIds.length > 0) {
            user.resumes += 1;
            await user.save();

            // Send confirmation email
            await transporter.sendMail({
              from: '"ZvertexAI Team" <zvertexai@honotech.com>',
              to: user.email,
              subject: 'ZvertexAI - Auto-Apply Confirmation',
              html: `
                <div style="font-family: Roboto, Arial, sans-serif; color: #333; background: #f5f5f5; padding: 20px; borderRadius: 8px;">
                  <h2 style="color: #1976d2;">Auto-Apply Confirmation</h2>
                  <p>Dear ${user.name},</p>
                  <p>Your profile has been auto-applied to ${jobIds.length} job(s):</p>
                  <ul>
                    ${jobsToApply.map((job, index) => `
                      <li>
                        <strong>Job ID:</strong> ${jobIds[index] || 'N/A'}<br>
                        <strong>Title:</strong> ${job.title}<br>
                        <strong>Company:</strong> ${job.company}<br>
                        <strong>Location:</strong> ${job.location}<br>
                        <strong>Apply Here:</strong> <a href="${job.jobLink}">${job.jobLink}</a>
                      </li>
                    `).join('')}
                  </ul>
                  <p><strong>Technology:</strong> ${technology}</p>
                  <p><strong>Companies:</strong> ${companies.join(', ')}</p>
                  <p><strong>Resume count:</strong> ${user.resumes}</p>
                  <p>Contact: <a href="mailto:zvertex.247@gmail.com">zvertex.247@gmail.com</a> or +1(918) 924-5130</p>
                  <p style="color: #6B7280;">Best regards,<br>The ZvertexAI Team</p>
                </div>
              `
            });
          }
        }
      }
    } catch (error) {
      console.error('Cron auto-apply error:', error.message);
    }
  });
};

module.exports = { startAutoApply };