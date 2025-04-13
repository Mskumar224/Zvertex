const axios = require('axios');
const puppeteer = require('puppeteer');
const config = require('config');

const applyToJob = async (jobLink, userData) => {
  let browser;
  try {
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(jobLink, { waitUntil: 'networkidle2' });
    // Simulate job application (mocked)
    console.log(`Mock applying to ${jobLink} for ${userData.email}`);
    await browser.close();
  } catch (err) {
    console.error('Apply error:', err.message);
    if (browser) await browser.close();
  }
};

// Fetch jobs via internal API
const fetchJobs = async () => {
  try {
    const apiUrl = process.env.API_URL || 'http://localhost:5000';
    const response = await axios.get(`${apiUrl}/api/jobs`);
    return response.data;
  } catch (err) {
    console.error('Job fetch error in automation:', err.message);
    // Fallback mock jobs
    return [
      {
        jobId: '1',
        jobTitle: 'Frontend Developer',
        company: 'Google',
        technology: 'React',
        jobLink: 'https://careers.google.com/jobs/123',
        date: new Date(),
      },
      {
        jobId: '2',
        jobTitle: 'Backend Engineer',
        company: 'Amazon',
        technology: 'Node.js',
        jobLink: 'https://amazon.jobs/en/jobs/456',
        date: new Date(),
      },
    ];
  }
};

module.exports = { applyToJob, fetchJobs };