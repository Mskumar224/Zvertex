const cron = require('node-cron');
const nodemailer = require('nodemailer');
const puppeteer = require('puppeteer');
const User = require('../models/User');
const Job = require('../models/Job');
const Profile = require('../models/Profile');
const { fetchJobs, reliableCompanies } = require('./jobApis');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

async function applyJob(job, profile, user) {
  const newJob = new Job({
    jobId: job.id,
    title: job.title,
    company: job.company,
    link: job.link,
    applied: true,
    user: user._id,
    requiresDocs: job.requiresDocs,
    profile: profile?._id,
    contactEmail: job.contactEmail,
    contactPhone: job.contactPhone,
  });
  await newJob.save();
  user.jobsApplied.push(newJob._id);
  await user.save();

  if (job.requiresDocs && profile?.additionalDetails) {
    try {
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      await page.goto(job.link, { waitUntil: 'networkidle2' });

      await page.type('input[name="firstName"], input[id*="first"]', user.name.split(' ')[0] || '');
      await page.type('input[name="lastName"], input[id*="last"]', user.name.split(' ')[1] || '');
      await page.type('input[name="email"], input[type="email"]', user.email);
      await page.type('input[name="phone"], input[type="tel"]', user.phone || '');
      if (profile.additionalDetails.address) {
        await page.type('input[name="address"], textarea[name="address"]', profile.additionalDetails.address);
      }
      if (profile.additionalDetails.linkedin) {
        await page.type('input[name="linkedin"], input[id*="linkedin"]', profile.additionalDetails.linkedin);
      }

      const applyButton = await page.$('button[type="submit"], input[type="submit"], a[id*="apply"]');
      if (applyButton) await applyButton.click();

      await browser.close();
      console.log(`Detailed apply completed for ${job.title}`);
    } catch (error) {
      console.error(`Puppeteer error for ${job.title}:`, error.message);
    }
  }

  await transporter.sendMail({
    from: '"ZvertexAI Team" <zvertexai@honotech.com>',
    to: user.email,
    subject: 'ZvertexAI - Job Application Confirmation',
    html: `
      <div style="font-family: Roboto, Arial, sans-serif; color: #333;">
        <h2 style="color: #1976d2;">Auto-Application Confirmed</h2>
        <p>Dear ${user.name || user.email},</p>
        <p>We’ve auto-applied for you to:</p>
        <ul>
          <li><strong>Position:</strong> ${job.title}</li>
          <li><strong>Company:</strong> ${job.company}</li>
          <li><strong>Job ID:</strong> ${job.id}</li>
          <li><strong>Link:</strong> <a href="${job.link}" style="color: #1976d2;">${job.link}</a></li>
          <li><strong>Contact Email:</strong> ${job.contactEmail || 'N/A'}</li>
          <li><strong>Contact Phone:</strong> ${job.contactPhone || 'N/A'}</li>
        </ul>
        <p>Best regards,<br>The ZvertexAI Team</p>
      </div>
    `,
  });
}

async function requestAdditionalDetails(user, profile, job) {
  await transporter.sendMail({
    from: '"ZvertexAI Team" <zvertexai@honotech.com>',
    to: user.email,
    subject: 'ZvertexAI - Additional Details Required',
    html: `
      <div style="font-family: Roboto, Arial, sans-serif; color: #333;">
        <h2 style="color: #1976d2;">Additional Details Needed</h2>
        <p>Dear ${user.name || user.email},</p>
        <p>The job "${job.title}" at ${job.company} requires additional details to complete the application.</p>
        <p>Please update your profile with the following:</p>
        <ul>
          <li>Address</li>
          <li>LinkedIn Profile</li>
          <li>GitHub Profile</li>
          <li>Portfolio</li>
          <li>Experience</li>
          <li>Education</li>
        </ul>
        <p><a href="https://zvertexai.netlify.app/job-apply" style="color: #1976d2;">Update Profile</a></p>
        <p>Best regards,<br>The ZvertexAI Team</p>
      </div>
    `,
  });
}

function scheduleRecurringJobs() {
  cron.schedule('*/30 * * * *', async () => {
    const users = await User.find().populate('jobsApplied profiles selectedProfile');
    for (const user of users) {
      const planLimits = { STUDENT: 45, RECRUITER: 225, BUSINESS: 675 };
      const today = new Date().setHours(0, 0, 0, 0);
      const todayJobs = user.jobsApplied.filter(job => new Date(job.createdAt).setHours(0, 0, 0, 0) === today);
      const submissionsLeft = planLimits[user.subscription] - todayJobs.length;

      if (submissionsLeft <= 0 || !user.selectedCompanies || !user.selectedTechnology) continue;

      const profilesToApply = user.subscription === 'STUDENT' ? [user.selectedProfile || user.profiles[0]] :
                              user.subscription === 'RECRUITER' ? user.profiles.slice(0, 5) :
                              profilesToApply.slice(0, 15); // Fixed: Changed user.pro strategiestoApply to profilesToApply

      for (const profile of profilesToApply.filter(p => p)) {
        const technology = profile.extractedTech || user.selectedTechnology;
        const companies = reliableCompanies.filter(c => user.selectedCompanies.includes(c)).slice(0, submissionsLeft);

        const jobs = await fetchJobs(technology, companies, 1);
        const appliedJobs = await Job.find({ user: user._id }).select('jobId');
        const appliedIds = appliedJobs.map(job => job.jobId);

        for (const job of jobs.filter(j => j && !appliedIds.includes(j.id))) {
          if (job.requiresDocs && !profile.additionalDetails?.address) {
            await requestAdditionalDetails(user, profile, job);
            continue;
          }
          await applyJob(job, profile, user);
        }
      }
    }
  });
}

module.exports = { scheduleRecurringJobs };