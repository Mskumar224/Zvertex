const Job = require('../models/Job');

const autoApplyJobs = async (resumeText, jobs, user) => {
  const appliedJobs = [];

  for (const job of jobs) {
    // Simple keyword matching (case-insensitive)
    const resumeLower = resumeText.toLowerCase();
    const jobDescLower = job.description.toLowerCase();
    const keywords = ['javascript', 'python', 'react', 'node.js', 'sql', 'product management'];
    const matchScore = keywords.reduce((score, keyword) => {
      return score + (resumeLower.includes(keyword) && jobDescLower.includes(keyword) ? 1 : 0);
    }, 0);

    if (matchScore > 0) { // Apply if at least one keyword matches
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