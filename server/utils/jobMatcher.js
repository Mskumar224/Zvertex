const Job = require('../models/Job');

const autoApplyJobs = async (resumeText, jobs, user) => {
  const appliedJobs = [];

  // Get previously applied jobs to avoid duplicates
  const existingJobs = await Job.find({ userId: user._id });
  const appliedJobKeys = existingJobs.map(job => `${job.title}:${job.company}`);

  for (const job of jobs) {
    const jobKey = `${job.title}:${job.company}`;
    if (appliedJobKeys.includes(jobKey)) {
      console.log('Skipping already applied job:', { title: job.title, company: job.company });
      continue;
    }

    // Simple keyword matching
    const resumeLower = resumeText.toLowerCase();
    const jobDescLower = job.description.toLowerCase();
    const keywords = ['javascript', 'python', 'react', 'node.js', 'sql', 'product management'];
    const matchScore = keywords.reduce((score, keyword) => {
      return score + (resumeLower.includes(keyword) && jobDescLower.includes(keyword) ? 1 : 0);
    }, 0);

    if (matchScore > 0) {
      const newJob = new Job({
        userId: user._id,
        title: job.title,
        company: job.company,
        status: 'Applied',
        appliedAt: new Date(),
      });
      await newJob.save();
      appliedJobs.push({ ...job, appliedAt: newJob.appliedAt });
      console.log('Auto-applied to job:', { title: job.title, company: job.company, userId: user._id });
    }
  }

  return appliedJobs;
};

module.exports = { autoApplyJobs };