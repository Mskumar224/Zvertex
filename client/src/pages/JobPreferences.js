import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function JobPreferences() {
  const [jobType, setJobType] = useState('Full Time');
  const [locationZip, setLocationZip] = useState('');
  const [jobPosition, setJobPosition] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const history = useHistory();

  const validateZip = (zip) => {
    const zipRegex = /^\d{5}$/;
    return zipRegex.test(zip);
  };

  const handleSubmit = async () => {
    if (!jobType || !locationZip || !jobPosition) {
      setError('Please fill in all fields.');
      return;
    }

    if (!validateZip(locationZip)) {
      setError('Please enter a valid 5-digit zip code.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/job/set-preferences`,
        { jobType, locationZip, jobPosition },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setError('');
      setSuccess('Job preferences saved successfully.');
      setTimeout(() => history.push('/student-dashboard'), 2000);
    } catch (error) {
      console.error('Set preferences error:', error.response?.data?.error || error.message);
      setError(error.response?.data?.error || 'Failed to save job preferences. Please try again.');
      setSuccess('');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Box sx={{ bgcolor: '#fff', p: 4, borderRadius: 2, boxShadow: 3 }}>
        <Button
          onClick={() => history.push('/student-dashboard')}
          sx={{ mb: 3, color: '#fff', bgcolor: '#00e676', '&:hover': { bgcolor: '#00c853' } }}
        >
          Back
        </Button>
        <Typography variant="h4" gutterBottom align="center">
          Set Job Preferences
        </Typography>
        <Typography sx={{ mb: 3, textAlign: 'center' }}>
          Specify your job preferences to enable auto-application to suitable jobs.
        </Typography>
        <Box component="form" sx={{ mt: 3 }}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Job Type</InputLabel>
            <Select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
            >
              <MenuItem value="Full Time">Full Time</MenuItem>
              <MenuItem value="Contract">Contract</MenuItem>
              <MenuItem value="Part Time">Part Time</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Location Zip Code"
            fullWidth
            value={locationZip}
            onChange={(e) => setLocationZip(e.target.value)}
            sx={{ mb: 3 }}
            variant="outlined"
          />
          <TextField
            label="Job Position"
            fullWidth
            value={jobPosition}
            onChange={(e) => setJobPosition(e.target.value)}
            sx={{ mb: 3 }}
            variant="outlined"
          />
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          {success && (
            <Typography color="success" sx={{ mb: 2 }}>
              {success}
            </Typography>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            fullWidth
            sx={{ py: 1.5 }}
          >
            Save Preferences
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default JobPreferences;