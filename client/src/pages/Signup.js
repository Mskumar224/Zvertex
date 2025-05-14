import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, useMediaQuery, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function Signup() {
  const [formData, setFormData] = useState({
    email: '', password: '', name: '', phone: '', subscriptionType: 'STUDENT'
  });
  const [otp, setOtp] = useState('');
  const [userId, setUserId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const isMobile = useMediaQuery('(max-width:600px)');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log('Sending POST to /api/auth/signup:', formData);
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/signup`, formData);
      setUserId(response.data.userId);
      setMessage(response.data.message);
      setError('');
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.response?.data?.message || 'Signup failed');
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log('Sending OTP verification:', { userId, otp });
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/verify-subscription-otp`, { userId, otp });
      localStorage.setItem('token', response.data.token);
      console.log('Redirecting to:', response.data.redirect);
      history.push(response.data.redirect);
    } catch (err) {
      console.error('OTP verification error:', err);
      setError(err.response?.data?.message || 'OTP verification failed');
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth={isMobile ? 'xs' : 'sm'} sx={{ py: isMobile ? 4 : 8 }}>
      <Box
        sx={{
          p: isMobile ? 2 : 4,
          background: '#fff',
          borderRadius: 2,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          transition: 'all 0.3s ease',
        }}
      >
        <Typography
          variant={isMobile ? 'h5' : 'h4'}
          align="center"
          sx={{ color: '#1976d2', mb: 4, fontWeight: 600 }}
        >
          ZvertexAI - Signup
        </Typography>
        {message && (
          <Typography sx={{ color: '#115293', mb: 2, textAlign: 'center', fontSize: isMobile ? '0.9rem' : '1rem' }}>
            {message}
          </Typography>
        )}
        {error && (
          <Typography color="error" sx={{ mb: 2, textAlign: 'center', fontSize: isMobile ? '0.9rem' : '1rem' }}>
            {error}
          </Typography>
        )}
        {!userId ? (
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
              variant="outlined"
              size={isMobile ? 'small' : 'medium'}
              sx={{ '& .MuiInputBase-root': { borderRadius: '8px' } }}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
              variant="outlined"
              size={isMobile ? 'small' : 'medium'}
              sx={{ '& .MuiInputBase-root': { borderRadius: '8px' } }}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              variant="outlined"
              size={isMobile ? 'small' : 'medium'}
              sx={{ '& .MuiInputBase-root': { borderRadius: '8px' } }}
            />
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              margin="normal"
              required
              variant="outlined"
              size={isMobile ? 'small' : 'medium'}
              sx={{ '& .MuiInputBase-root': { borderRadius: '8px' } }}
            />
            <TextField
              fullWidth
              label="Subscription Type"
              name="subscriptionType"
              value={formData.subscriptionType}
              onChange={handleChange}
              margin="normal"
              select
              SelectProps={{ native: true }}
              variant="outlined"
              size={isMobile ? 'small' : 'medium'}
              sx={{ '& .MuiInputBase-root': { borderRadius: '8px' } }}
            >
              <option value="STUDENT">Student</option>
              <option value="RECRUITER">Recruiter</option>
              <option value="BUSINESS">Business</option>
            </TextField>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              sx={{
                mt: 3,
                py: isMobile ? 1 : 1.5,
                borderRadius: '25px',
                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                '&:hover': { background: 'linear-gradient(45deg, #1565c0, #2196f3)' },
                textTransform: 'none',
                fontSize: isMobile ? '0.9rem' : '1rem',
                fontWeight: 500,
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit}>
            <TextField
              fullWidth
              label="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              margin="normal"
              required
              variant="outlined"
              size={isMobile ? 'small' : 'medium'}
              sx={{ '& .MuiInputBase-root': { borderRadius: '8px' } }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              sx={{
                mt: 3,
                py: isMobile ? 1 : 1.5,
                borderRadius: '25px',
                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                '&:hover': { background: 'linear-gradient(45deg, #1565c0, #2196f3)' },
                textTransform: 'none',
                fontSize: isMobile ? '0.9rem' : '1rem',
                fontWeight: 500,
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify OTP'}
            </Button>
          </form>
        )}
      </Box>
    </Container>
  );
}

export default Signup;