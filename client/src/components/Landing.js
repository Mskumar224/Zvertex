import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, TextField, Button, Box } from '@mui/material';

const Landing = () => {
  const [technology, setTechnology] = useState('');
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');

  const fetchJobs = async () => {
    setError('');
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'https://zvertexai-orzv.onrender.com';
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${apiUrl}/api/jobs/fetch`,
        { technology },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token || '',
          },
        }
      );
      setJobs(res.data.jobs);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to fetch jobs');
      console.error('Fetch jobs error:', err);
    }
  };

  useEffect(() => {
    if (technology) {
      fetchJobs();
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <Box sx={{ maxWidth: '800px', mx: 'auto', mt: 4 }}>
      <Typography variant="h3" gutterBottom>
        Find Your Dream Job
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Technology (e.g., JavaScript)"
          value={technology}
          onChange={(e) => setTechnology(e.target.value)}
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          Search Jobs
        </Button>
      </form>
      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
      {jobs.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5">Job Listings</Typography>
          {jobs.map((job) => (
            <Box key={job.id} sx={{ mt: 2, p: 2, border: '1px solid #ccc' }}>
              <Typography variant="h6">{job.title}</Typography>
              <Typography>{job.company}</Typography>
              <Typography>{job.location}</Typography>
              <Typography>{job.description.slice(0, 200)}...</Typography>
              <Button href={job.redirect_url} target="_blank" variant="outlined" sx={{ mt: 1 }}>
                Apply
              </Button>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Landing;