import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, useMediaQuery } from '@mui/material';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();
  const isMobile = useMediaQuery('(max-width:600px)');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, { email, password });
      localStorage.setItem('token', data.token);
      const redirectPath = data.subscription === 'STUDENT' ? '/student-dashboard' :
                           data.subscription === 'RECRUITER' ? '/recruiter-dashboard' :
                           data.subscription === 'BUSINESS' ? '/business-dashboard' : '/subscription';
      history.push(redirectPath);
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(message);
      console.error('Login error:', err.response?.data);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email to reset password');
      return;
    }
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/forgot-password`, { email });
      setError('');
      alert('Password reset link sent to your email and zvertex.247@gmail.com');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset link');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Box sx={{ p: 4, background: '#fff', borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Typography
          variant={isMobile ? 'h5' : 'h4'}
          align="center"
          sx={{ color: '#1976d2', mb: 4, cursor: 'pointer' }}
          onClick={() => window.location.href = '/'}
        >
          ZvertexAI - Login
        </Typography>
        <TextField
          label="Email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 3 }}
          variant="outlined"
          error={!!error && !email.trim()}
          helperText={!!error && !email.trim() ? 'Email is required' : ''}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 3 }}
          variant="outlined"
          error={!!error && !password.trim()}
          helperText={!!error && !password.trim() ? 'Password is required' : ''}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleLogin}
          sx={{ py: 1.5, borderRadius: '25px' }}
        >
          Login
        </Button>
        {error && (
          <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
            {error}
            {error.includes('Invalid password') || error.includes('No account found') ? (
              <span>
                {' '}
                <Button color="primary" onClick={handleForgotPassword}>
                  Reset Password
                </Button>
              </span>
            ) : error.includes('not verified') ? (
              <span>
                {' '}
                Check zvertex.247@gmail.com for your OTP.
              </span>
            ) : null}
          </Typography>
        )}
        <Typography sx={{ mt: 2, textAlign: 'center', color: '#6B7280' }}>
          Forgot Password?{' '}
          <Button color="primary" onClick={handleForgotPassword}>
            Reset
          </Button>
        </Typography>
        <Typography sx={{ mt: 1, textAlign: 'center', color: '#6B7280' }}>
          Don’t have an account?{' '}
          <Button color="primary" onClick={() => history.push('/signup')}>
            Sign Up
          </Button>
        </Typography>
      </Box>
    </Container>
  );
}

export default Login;