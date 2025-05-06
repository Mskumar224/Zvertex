import React, { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import axios from 'axios';

function JobTracker() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/job/tracker`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(response.data);
        setError('');
      } catch (err) {
        console.error('Job tracker error:', err.response?.data?.error || err.message);
        setError('Failed to load job applications. Please try again later.');
      }
    };
    fetchJobs();
  }, []);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Your Job Applications
      </Typography>
      {error ? (
        <Typography color="error">{error}</Typography>
      ) : jobs.length === 0 ? (
        <Typography>No job applications yet.</Typography>
      ) : (
        jobs.map((job) => (
          <Box key={job._id} sx={{ mb: 2, p: 2, border: '1px solid #ccc' }}>
            <Typography><strong>Job Title:</strong> {job.title}</Typography>
            <Typography><strong>Company:</strong> {job.company}</Typography>
            <Typography><strong>Status:</strong> {job.status}</Typography>
            <Typography><strong>Applied On:</strong> {new Date(job.appliedAt).toLocaleDateString()}</Typography>
          </Box>
        ))
      )}
    </Box>
  );
}

export default JobTracker;