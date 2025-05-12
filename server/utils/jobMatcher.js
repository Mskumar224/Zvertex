const Job = require('../models/Job');

const autoApplyJobs = async (resumeText, jobs, user) => {
  const appliedJobs = [];

  for (const job of jobs) {
    // Check if job already applied
    const existingJob = await Job.findOne({
      userId: user._id,
      title: job.title,
      company: job.company,
    });

    if (existingJob) {
      console.log('Skipping already applied job:', { title: job.title, company: job.company });
      continue;
    }

    // Keyword matching
    const resumeLower = resumeText.toLowerCase();
    const jobDescLower = job.description.toLowerCase();
    const keywords = ['javascript', 'python', 'react', 'node.js', 'sql', 'product management'];
    const matchScore = keywords.reduce((score, keyword) => {
      return score + (resumeLower.includes(keyword) && jobDescLower.includes(keyword) ? 1 : 0);
    }, 0);

    if (matchScore > 0) {
      try {
        const newJob = await Job.findOneAndUpdate(
          { userId: user._id, title: job.title, company: job.company },
          {
            userId: user._id,
            title: job.title,
            company: job.company,
            status: 'Applied',
            appliedAt: new Date(),
          },
          { upsert: true, new: true }
        );
        appliedJobs.push({ ...job, appliedAt: newJob.appliedAt });
        console.log('Auto-applied to job:', { title: job.title, company: job.company, userId: user._id });
      } catch (error) {
        console.error('Error applying to job:', { title: job.title, company: job.company, error: error.message });
      }
    }
  }

  return appliedJobs;
};

module.exports = { autoApplyJobs };