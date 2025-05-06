const axios = require('axios');

const fetchJobs = async () => {
  try {
    // Mock job data (replace with real API call)
    console.log('Fetching real-time jobs (mock implementation)');
    const mockJobs = [
      { title: 'Software Engineer', company: 'Tech Corp', location: 'Remote', description: 'Develop web applications using Node.js and React.' },
      { title: 'Data Analyst', company: 'Data Inc', location: 'New York', description: 'Analyze data using Python and SQL.' },
      { title: 'Product Manager', company: 'Innovate Ltd', location: 'San Francisco', description: 'Lead product development for SaaS platform.' },
    ];
    return mockJobs;
    // Example with real API (uncomment when API is available):
    // const response = await axios.get('https://api.example.com/jobs', {
    //   params: { query: 'software engineer', location: 'remote' },
    //   headers: { Authorization: 'Bearer YOUR_API_KEY' },
    // });
    // return response.data.jobs;
  } catch (error) {
    console.error('Job fetch error:', error.message);
    return [];
  }
};

module.exports = { fetchJobs };