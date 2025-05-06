import React, { useState, useEffect } from 'react';
import { Typography, Box, Button } from '@mui/material';
import axios from 'axios';

function JobTracker() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/job/tracker`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(response.data);
      setError('');
      setRetryCount(0);
    } catch (err) {
      console.error('Job tracker error:', err.response?.data?.error || err.message);
      setError(err.response?.data?.error || 'Failed to load job applications. Please try again later.');
      if (retryCount < 3) {
        setTimeout(() => setRetryCount(retryCount + 1), 2000); // Retry after 2s
      }
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [retryCount]);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Your Job Applications
      </Typography>
      {error ? (
        <>
          <Typography color="error">{error}</Typography>
          <Button onClick={fetchJobs} variant="outlined" sx={{ mt: 2 }}>
            Retry
          </Button>
        </>
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