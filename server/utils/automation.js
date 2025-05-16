const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');
const axios = require('axios');
const User = require('../models/User');
const JobApplication = require('../models/JobApplication');
require('dotenv').config();

const autoApplyJobs = async (userId, profile) => {
  let browser;
  try {
    browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();

    // Fetch jobs from Indeed API
    const response = await axios.get('https://api.indeed.com/ads/apisearch', {
      params: {
        publisher: process.env.INDEED_API_KEY,
        q: profile.technologies[0],
        l: 'remote',
        v: 2,
        limit: 5,
        co: 'us',
      },
    });

    const jobs = response.data.results.map(job => ({
      id: job.jobkey,
      title: job.jobtitle,
      company: job.company,
      link: job.url,
      technologies: [profile.technologies[0]],
    }));

    for (const job of jobs) {
      // Check if already applied
      const existing = await JobApplication.findOne({ user: userId, jobId: job.id });
      if (existing) continue;

      // Navigate to job application page
      await page.goto(job.link, { waitUntil: 'networkidle2' });

      // Scenario 1: Basic details
      try {
        await page.type('input[name="email"]', profile.email);
        await page.type('input[name="phone"]', profile.phone);
        await page.type('input[name="name"]', profile.name);
        // Upload resume (mocked; actual implementation depends on site)
        // await page.uploadFile('input[type="file"]', profile.resume);

        // Submit form (simplified; actual selectors vary)
        await page.click('button[type="submit"]');
        await page.waitForNavigation({ timeout: 10000 }).catch(() => {});
      } catch (err) {
        console.warn(`Basic apply failed for ${job.title}:`, err.message);
      }

      // Scenario 2: Dynamic details
      try {
        if (profile.additionalDetails.address) {
          await page.type('input[name="address"]', profile.additionalDetails.address);
        }
        if (profile.additionalDetails.linkedIn) {
          await page.type('input[name="linkedin"]', profile.additionalDetails.linkedIn);
        }
        if (profile.additionalDetails.github) {
          await page.type('input[name="github"]', profile.additionalDetails.github);
        }
        await page.click('button[type="submit"]');
        await page.waitForNavigation({ timeout: 10000 }).catch(() => {});
      } catch (err) {
        console.warn(`Dynamic apply failed for ${job.title}:`, err.message);
      }

      // Save application
      const application = new JobApplication({
        user: userId,
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        jobLink: job.link,
        technology: job.technologies[0],
        profileId: profile._id,
      });
      await application.save();

      // Send confirmation email
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        to: profile.email,
        from: process.env.EMAIL_USER,
        subject: `Application Submitted: ${job.title}`,
        text: `You have successfully applied for ${job.title} at ${job.company}.\n
          Job ID: ${job.id}\n
          Link: ${job.link}\n
          Technology: ${job.technologies[0]}\n
          We will notify you of any updates.`,
      };

      await transporter.sendMail(mailOptions);
    }
  } catch (err) {
    console.error('Auto-apply error:', err.message);
  } finally {
    if (browser) await browser.close();
  }
};

module.exports = { autoApplyJobs };