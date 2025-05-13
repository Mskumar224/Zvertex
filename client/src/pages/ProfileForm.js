import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Box } from '@mui/material';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function ProfileForm() {
  const [formData, setFormData] = useState({
    phone: '',
    address: '',
    linkedin: '',
    github: '',
    portfolio: '',
    skills: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/user`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFormData({
          phone: response.data.phone || '',
          address: response.data.address || '',
          linkedin: response.data.linkedin || '',
          github: response.data.github || '',
          portfolio: response.data.portfolio || '',
          skills: response.data.skills?.join(', ') || ''
        });
      } catch (err) {
        console.error('Fetch user error:', err);
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');
      const dataToSend = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim())
      };
      console.log('Sending PATCH to /api/auth/user:', dataToSend);
      const response = await axios.patch(`${process.env.REACT_APP_API_URL}/api/auth/user`, dataToSend, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(response.data.message);
      setError('');
      setTimeout(() => history.push('/student-dashboard'), 3000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update profile';
      setError(errorMessage);
      setMessage('');
      console.error('Profile update error:', errorMessage, {
        status: err.response?.status,
        data: err.response?.data
      });
    }
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        py: 4,
        ml: { xs: 0, md: '260px' },
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          p: { xs: 3, sm: 4 },
          background: '#fff',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: 600,
          transition: 'all 0.3s ease',
        }}
      >
        <Typography
          variant="h4"
          align="center"
          sx={{ color: '#1976d2', mb: 3, fontWeight: 600 }}
        >
          ZvertexAI - Update Profile
        </Typography>
        {message && (
          <Typography sx={{ color: '#115293', mb: 2, textAlign: 'center', fontSize: '0.9rem' }}>
            {message}
          </Typography>
        )}
        {error && (
          <Typography sx={{ color: 'error.main', mb: 2, textAlign: 'center', fontSize: '0.9rem' }}>
            {error}
          </Typography>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            margin="normal"
            required
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="LinkedIn URL"
            name="linkedin"
            value={formData.linkedin}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="GitHub URL"
            name="github"
            value={formData.github}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Portfolio URL"
            name="portfolio"
            value={formData.portfolio}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Skills (comma-separated)"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, py: 1.2, fontSize: '1rem' }}
          >
            Update Profile
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default ProfileForm;