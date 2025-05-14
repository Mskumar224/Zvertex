import React, { useState } from 'react';
import { Container, Button, Typography, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Companies: React.FC = () => {
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const companies = [
    'Google',
    'Microsoft',
    'Amazon',
    'Facebook',
    'Apple',
    'Tesla',
    'Netflix',
    'IBM',
    'Intel',
    'Cisco',
  ];

  const handleChange = (event: any) => {
    setSelectedCompanies(event.target.value as string[]);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Please log in to select companies.');
      setTimeout(() => navigate('/login'), 1000);
      return;
    }
    try {
      await axios.post('https://zvertexai-orzv.onrender.com/api/select-companies', {
        companies: selectedCompanies,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.setItem('selectedCompanies', JSON.stringify(selectedCompanies));
      setMessage('Companies selected successfully! Redirecting to auto-apply...');
      setTimeout(() => navigate('/confirm-auto-apply'), 1000);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Server error';
      if (error.response?.status === 401 || error.response?.status === 403) {
        setMessage('Unauthorized: Please log in again.');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        setTimeout(() => navigate('/login'), 1000);
      } else if (error.response?.status === 404) {
        setMessage('Companies endpoint not found. Please check the server.');
      } else if (error.response?.status === 400) {
        setMessage(`Selection failed: ${errorMessage}`);
      } else {
        setMessage(`Selection failed: ${errorMessage}`);
      }
    }
  };

  return (
    <Container className="glass-card" sx={{ mt: 5, py: 5 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 500 }}>Select Companies</Typography>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Companies</InputLabel>
        <Select
          multiple
          value={selectedCompanies}
          onChange={handleChange}
          label="Companies"
        >
          {companies.map((company) => (
            <MenuItem key={company} value={company}>
              {company}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{ mt: 2, mr: 2, px: 4, py: 1.5 }}
        >
          Submit
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate('/dashboard')}
          sx={{ mt: 2, px: 4, py: 1.5 }}
        >
          Back
        </Button>
      </Box>
      {message && (
        <Typography sx={{ mt: 2, color: message.includes('failed') || message.includes('Unauthorized') ? '#dc3545' : '#28a745' }}>
          {message}
        </Typography>
      )}
    </Container>
  );
};

export default Companies;