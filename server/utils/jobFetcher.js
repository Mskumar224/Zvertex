const axios = require('axios');

const fetchJobs = async (preferences = {}) => {
  try {
    console.log('Fetching real-time jobs with preferences:', preferences);
    const mockJobs = [
      { jobId: 'job1', title: 'Software Engineer', company: 'Tech Corp', location: 'Remote', description: 'Develop web applications using Node.js and React.', jobType: 'Full Time' },
      { jobId: 'job2', title: 'Data Analyst', company: 'Data Inc', location: 'New York, 10001', description: 'Analyze data using Python and SQL.', jobType: 'Contract' },
      { jobId: 'job3', title: 'Product Manager', company: 'Innovate Ltd', location: 'San Francisco, 94105', description: 'Lead product development for SaaS platform.', jobType: 'Full Time' },
      { jobId: 'job4', title: 'Frontend Developer', company: 'Web Solutions', location: 'Remote', description: 'Build UI with React and TypeScript.', jobType: 'Part Time' },
    ];

    const filteredJobs = mockJobs.filter(job => {
      const matchesJobType = preferences.jobType ? job.jobType === preferences.jobType : true;
      const matchesLocation = preferences.locationZip ? job.location.includes(preferences.locationZip) || job.location === 'Remote' : true;
      const matchesPosition = preferences.jobPosition ? job.title.toLowerCase().includes(preferences.jobPosition.toLowerCase()) : true;
      return matchesJobType && matchesLocation && matchesPosition;
    });

    return filteredJobs;
  } catch (error) {
    console.error('Job fetch error:', error.message);
    return [];
  }
};

module.exports = { fetchJobs };