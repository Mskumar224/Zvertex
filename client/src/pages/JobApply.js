import React, { useState, useEffect } from 'react';
import { Container, Button, Typography, Box, Select, MenuItem, FormControl, InputLabel, useMediaQuery } from '@mui/material';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function JobApply() {
  const [selectedTechnology, setSelectedTechnology] = useState('');
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [resume, setResume] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const history = useHistory();
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSelectedTechnology(response.data.selectedTechnology || '');
        setSelectedCompanies(response.data.selectedCompanies || []);
      } catch (err) {
        setError('Failed to load preferences');
        console.error('Fetch user error:', err.message);
      }
    };
    fetchUser();
  }, []);

  const handleSavePreferences = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token');
      await axios.patch(`${process.env.REACT_APP_API_URL}/api/auth/user`, {
        selectedTechnology,
        selectedCompanies,
      }, { headers: { Authorization: `Bearer ${token}` } });
      setSuccess('Preferences saved');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save preferences');
      console.error('Save preferences error:', err.message);
    }
  };

  const handleAutoApply = async () => {
    if (!resume) {
      setError('Select a resume file');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token');
      const formData = new FormData();
      formData.append('resume', resume);
      await axios.post(`${process.env.REACT_APP_API_URL}/api/job/upload`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      setSuccess('Application submitted! Confirmation sent to zvertex.247@gmail.com');
      setError('');
      setTimeout(() => history.push('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Application failed');
      console.error('Auto apply error:', err.message);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Box sx={{ p: 4, background: '#fff', borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Typography variant={isMobile ? 'h5' : 'h4'} align="center" sx={{ color: '#1976d2', mb: 4 }}>
          ZvertexAI - Job Application
        </Typography>
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Technology</InputLabel>
          <Select value={selectedTechnology} onChange={(e) => setSelectedTechnology(e.target.value)} label="Technology">
            <MenuItem value="JavaScript">JavaScript</MenuItem>
            <MenuItem value="Python">Python</MenuItem>
            <MenuItem value="Java">Java</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Companies</InputLabel>
          <Select multiple value={selectedCompanies} onChange={(e) => setSelectedCompanies(e.target.value)} label="Companies">
            <MenuItem value="Indeed">Indeed</MenuItem>
            <MenuItem value="LinkedIn">LinkedIn</MenuItem>
            <MenuItem value="Glassdoor">Glassdoor</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" fullWidth onClick={handleSavePreferences} sx={{ py: 1.5, borderRadius: '25px', mb: 3 }}>
          Save Preferences
        </Button>
        <Typography variant="body1" sx={{ mb: 2 }}>Upload Resume (PDF only)</Typography>
        <input type="file" accept="application/pdf" onChange={(e) => setResume(e.target.files[0])} style={{ mb: 2, display: 'block' }} />
        <Button variant="contained" color="primary" fullWidth onClick={handleAutoApply} sx={{ py: 1.5, borderRadius: '25px' }}>
          Auto Apply
        </Button>
        {error && <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>{error}</Typography>}
        {success && <Typography color="success.main" sx={{ mt: 2, textAlign: 'center' }}>{success}</Typography>}
      </Box>
    </Container>
  );
}

export default JobApply;