import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, useMediaQuery, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function JobApply() {
  const [formData, setFormData] = useState({
    selectedTechnology: '',
    selectedCompanies: [],
    resume: null
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();
  const isMobile = useMediaQuery('(max-width:600px)');

  const handleChange = (e) => {
    if (e.target.name === 'selectedCompanies') {
      setFormData({ ...formData, selectedCompanies: Array.isArray(e.target.value) ? e.target.value : [e.target.value] });
    } else if (e.target.name === 'resume') {
      setFormData({ ...formData, resume: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
      if (!formData.resume) throw new Error('Please upload a resume');

      const { selectedTechnology, selectedCompanies } = formData;
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/auth/user`,
        { selectedTechnology, selectedCompanies },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const formDataToSend = new FormData();
      formDataToSend.append('resume', formData.resume);
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/job/apply`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessage(response.data.message || 'Preferences saved and job application submitted successfully!');
      setError('');
      setTimeout(() => history.push('/student-dashboard'), 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to save preferences or apply for job';
      setError(errorMessage);
      setMessage('');
      console.error('Auto apply error:', errorMessage, err.response?.data);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box sx={{ p: 4, background: '#fff', borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Typography variant={isMobile ? 'h5' : 'h4'} align="center" sx={{ color: '#1976d2', mb: 4 }}>
          ZvertexAI - Job Application
        </Typography>
        {message && (
          <Typography sx={{ color: '#115293', mb: 2, textAlign: 'center' }}>
            {message}
          </Typography>
        )}
        {error && (
          <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
            {error}
          </Typography>
        )}
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Preferred Technology</InputLabel>
            <Select
              name="selectedTechnology"
              value={formData.selectedTechnology}
              onChange={handleChange}
              required
            >
              <MenuItem value="JavaScript">JavaScript</MenuItem>
              <MenuItem value="Python">Python</MenuItem>
              <MenuItem value="Java">Java</MenuItem>
              <MenuItem value="C++">C++</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Preferred Companies</InputLabel>
            <Select
              name="selectedCompanies"
              multiple
              value={formData.selectedCompanies}
              onChange={handleChange}
              required
            >
              <MenuItem value="Indeed">Indeed</MenuItem>
              <MenuItem value="LinkedIn">LinkedIn</MenuItem>
              <MenuItem value="Glassdoor">Glassdoor</MenuItem>
              <MenuItem value="Monster">Monster</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            type="file"
            name="resume"
            onChange={handleChange}
            margin="normal"
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3, py: 1.5, borderRadius: '25px' }}
          >
            Save Preferences & Apply
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default JobApply;