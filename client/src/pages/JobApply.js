import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Select, MenuItem, InputLabel, FormControl, useMediaQuery, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function JobApply() {
  const [formData, setFormData] = useState({ selectedTechnology: '', selectedCompanies: [], resume: null });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const isMobile = useMediaQuery('(max-width:600px)');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'selectedCompanies') {
      setFormData({ ...formData, selectedCompanies: typeof value === 'string' ? value.split(',') : value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e) => setFormData({ ...formData, resume: e.target.files[0] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
      await axios.patch(`${process.env.REACT_APP_API_URL}/api/auth/user`, {
        selectedTechnology: formData.selectedTechnology,
        selectedCompanies: formData.selectedCompanies
      }, { headers: { Authorization: `Bearer ${token}` } });
      const formDataToSend = new FormData();
      formDataToSend.append('resume', formData.resume);
      formDataToSend.append('technology', formData.selectedTechnology);
      formDataToSend.append('companies', JSON.stringify(formData.selectedCompanies));
      await axios.post(`${process.env.REACT_APP_API_URL}/api/job/apply`, formDataToSend, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      const userResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/user`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await axios.post(`${process.env.REACT_APP_API_URL}/api/job/confirm`, {
        email: userResponse.data.email,
        technology: formData.selectedTechnology,
        companies: formData.selectedCompanies
      }, { headers: { Authorization: `Bearer ${token}` } });
      setMessage('Application submitted successfully! Check your email for confirmation.');
      setError('');
      setTimeout(() => history.push('/student-dashboard'), 2000);
    } catch (err) {
      console.error('Job apply error:', err);
      setError(err.response?.data?.message || 'Failed to submit application.');
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth={isMobile ? 'xs' : 'sm'} sx={{ py: isMobile ? 4 : 8 }}>
      <Box sx={{ p: isMobile ? 2 : 4, background: '#fff', borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
        <Typography variant={isMobile ? 'h5' : 'h4'} align="center" sx={{ color: '#1976d2', mb: 4, fontWeight: 600 }}>
          ZvertexAI - Job Application
        </Typography>
        {message && <Typography sx={{ color: '#115293', mb: 2, textAlign: 'center' }}>{message}</Typography>}
        {error && <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>{error}</Typography>}
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal" variant="outlined" size={isMobile ? 'small' : 'medium'}>
            <InputLabel>Technology</InputLabel>
            <Select name="selectedTechnology" value={formData.selectedTechnology} onChange={handleChange} label="Technology" required>
              <MenuItem value="JavaScript">JavaScript</MenuItem>
              <MenuItem value="Python">Python</MenuItem>
              <MenuItem value="Java">Java</MenuItem>
              <MenuItem value="C++">C++</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal" variant="outlined" size={isMobile ? 'small' : 'medium'}>
            <InputLabel>Companies</InputLabel>
            <Select name="selectedCompanies" value={formData.selectedCompanies} onChange={handleChange} label="Companies" multiple required>
              <MenuItem value="Indeed">Indeed</MenuItem>
              <MenuItem value="LinkedIn">LinkedIn</MenuItem>
              <MenuItem value="Glassdoor">Glassdoor</MenuItem>
              <MenuItem value="Monster">Monster</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ mt: 2, mb: 2 }}>
            <input type="file" accept=".pdf" onChange={handleFileChange} required />
          </Box>
          <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading} sx={{ mt: 3, py: isMobile ? 1 : 1.5, fontSize: isMobile ? '0.9rem' : '1rem' }}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit Application'}
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default JobApply;