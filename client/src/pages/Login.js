import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Link } from '@mui/material';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [otp, setOtp] = useState('');
  const [userId, setUserId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Sending POST to /api/auth/login:', { email: formData.email });
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, formData, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.data.needsOtp) {
        setUserId(response.data.userId);
        setMessage(response.data.message);
        setError('');
      } else {
        localStorage.setItem('token', response.data.token);
        history.push(response.data.redirect);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      setError(errorMessage);
      setMessage('');
      console.error('Login error:', errorMessage, {
        status: err.response?.status,
        data: err.response?.data,
        url: err.config?.url,
        headers: err.config?.headers,
        method: err.config?.method,
        responseText: err.response?.data
      });
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Sending POST to /api/auth/verify-subscription-otp:', { userId, otp });
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/verify-subscription-otp`, { userId, otp });
      localStorage.setItem('token', response.data.token);
      history.push(response.data.redirect);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'OTP verification failed';
      setError(errorMessage);
      setMessage('');
      console.error('OTP verification error:', errorMessage, {
        status: err.response?.status,
        data: err.response?.data,
        url: err.config?.url,
        headers: err.config?.headers,
        method: err.config?.method,
        responseText: err.response?.data
      });
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        py: 4,
        ml: { xs: 0, md: '260px' },
        display: 'flex',
        justifyContent: 'center',
        minHeight: '100vh',
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
          maxWidth: 400,
          transition: 'all 0.3s ease',
        }}
      >
        <Typography
          variant="h4"
          align="center"
          sx={{ color: '#1976d2', mb: 3, fontWeight: 600 }}
        >
          ZvertexAI - Login
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
        {!userId ? (
          <form onSubmit={handleSubmit}>
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
              sx={{ mb: 2 }}
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
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2, py: 1.2, fontSize: '1rem' }}
            >
              Log In
            </Button>
            <Link
              href="/forgot-password"
              sx={{
                display: 'block',
                textAlign: 'center',
                mt: 2,
                color: '#1976d2',
                textDecoration: 'none',
                fontSize: '0.9rem',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Forgot Password?
            </Link>
            <Link
              href="/signup"
              sx={{
                display: 'block',
                textAlign: 'center',
                mt: 1,
                color: '#1976d2',
                textDecoration: 'none',
                fontSize: '0.9rem',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Don't have an account? Sign Up
            </Link>
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
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2, py: 1.2, fontSize: '1rem' }}
            >
              Verify OTP
            </Button>
          </form>
        )}
      </Box>
    </Container>
  );
}

export default Login;