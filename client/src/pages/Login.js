import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, useMediaQuery, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const isMobile = useMediaQuery('(max-width:600px)');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log('Sending POST to /api/auth/login:', formData);
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, formData);
      console.log('Login response:', response.data);
      localStorage.setItem('token', response.data.token);
      setMessage('Login successful. Redirecting to dashboard...');
      setError('');
      // Force navigation with replace to avoid back navigation issues
      setTimeout(() => history.replace(response.data.redirect), 1000);
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      if (err.response?.data?.redirect === '/signup') {
        setError(err.response.data.message);
        setTimeout(() => history.replace('/signup'), 2000);
      } else {
        setError(err.response?.data?.message || 'Login failed. Please try again.');
      }
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth={isMobile ? 'xs' : 'sm'} sx={{ py: isMobile ? 4 : 8 }}>
      <Box sx={{ p: isMobile ? 2 : 4, background: '#fff', borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
        <Typography variant={isMobile ? 'h5' : 'h4'} align="center" sx={{ color: '#1976d2', mb: 4, fontWeight: 600 }}>
          ZvertexAI - Login
        </Typography>
        {message && <Typography sx={{ color: '#115293', mb: 2, textAlign: 'center' }}>{message}</Typography>}
        {error && <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>{error}</Typography>}
        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="Email" name="email" type="email" value={formData.email} onChange={handleChange} margin="normal" required variant="outlined" size={isMobile ? 'small' : 'medium'} />
          <TextField fullWidth label="Password" name="password" type="password" value={formData.password} onChange={handleChange} margin="normal" required variant="outlined" size={isMobile ? 'small' : 'medium'} />
          <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading} sx={{ mt: 3, py: isMobile ? 1 : 1.5, fontSize: isMobile ? '0.9rem' : '1rem' }}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Log In'}
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default Login;