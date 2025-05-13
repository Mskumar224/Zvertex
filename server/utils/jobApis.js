const axios = require('axios');

const reliableCompanies = ['Indeed', 'LinkedIn', 'Glassdoor', 'Monster', 'CareerBuilder'];

async function fetchJobsFromIndeed(technology, limit = 1) {
  try {
    const response = await axios.get('https://api.indeed.com/ads/apisearch', {
      params: {
        publisher: process.env.INDEED_PUBLISHER_ID,
        v: 2,
        format: 'json',
        q: technology,
        limit,
        start: Math.floor(Math.random() * 100),
      },
      timeout: 5000,
    });
    return response.data.results.map(job => ({
      id: job.jobkey,
      title: job.jobtitle,
      company: job.company,
      link: job.url,
      requiresDocs: Math.random() > 0.5,
      contactEmail: job.email || 'N/A',
      contactPhone: job.phone || 'N/A',
    }));
  } catch (error) {
    console.error('Indeed API error:', error.message);
    return [];
  }
}

async function fetchJobsFromLinkedIn(technology, limit = 1) {
  try {
    const response = await axios.get('https://api.linkedin.com/v2/jobs', {
      headers: { Authorization: `Bearer ${process.env.LINKEDIN_ACCESS_TOKEN}` },
      params: { keywords: technology, limit },
      timeout: 5000,
    });
    return response.data.elements.map(job => ({
      id: job.id,
      title: job.title,
      company: job.companyName,
      link: job.jobPostingUrl,
      requiresDocs: Math.random() > 0.5,
      contactEmail: job.contactEmail || 'N/A',
      contactPhone: job.contactPhone || 'N/A',
    }));
  } catch (error) {
    console.error('LinkedIn API error:', error.message);
    return [];
  }
}

async function fetchJobs(technology, companies, limit = 1) {
  const jobs = [];
  for (const company of companies) {
    if (company === 'Indeed') {
      jobs.push(...await fetchJobsFromIndeed(technology, limit));
    } else if (company === 'LinkedIn') {
      jobs.push(...await fetchJobsFromLinkedIn(technology, limit));
    }
  }
  return jobs;
}

module.exports = { fetchJobs, reliableCompanies };