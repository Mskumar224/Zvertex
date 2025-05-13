import React, { useState } from 'react';
import { Container, Button, Typography, Box, TextField, useMediaQuery } from '@mui/material';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [otp, setOtp] = useState('');
  const [userId, setUserId] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [error, setError] = useState('');
  const history = useHistory();
  const isMobile = useMediaQuery('(max-width:600px)');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async () => {
    const { email, password } = form;
    if (!email || !password) {
      setError('Email and password required');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Invalid email format');
      return;
    }
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, form);
      if (data.needsOtp) {
        setUserId(data.userId);
        setShowOtp(true);
        setError('');
      } else {
        localStorage.setItem('token', data.token);
        history.push(data.redirect);
        window.location.reload();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      console.error('Login error:', err.message);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setError('Please enter OTP');
      return;
    }
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/verify-subscription-otp`, { userId, otp });
      localStorage.setItem('token', data.token);
      history.push(data.redirect);
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed');
      console.error('OTP verification error:', err.message);
    }
  };

  const handleForgotPassword = async () => {
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) {
      setError('Enter a valid email');
      return;
    }
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/forgot-password`, { email: form.email });
      setError('');
      alert('Check zvertex.247@gmail.com or call +1(918) 924-5130 for reset link');
    } catch (err) {
      setError(err.response?.data?.message || 'Reset link failed');
      console.error('Forgot password error:', err.message);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Box sx={{ p: 4, background: '#fff', borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Typography variant={isMobile ? 'h5' : 'h4'} align="center" sx={{ color: '#1976d2', mb: 4 }} onClick={() => history.push('/')}>
          ZvertexAI - Login
        </Typography>
        <TextField label="Email" name="email" fullWidth value={form.email} onChange={handleChange} sx={{ mb: 3 }} />
        <TextField label="Password" name="password" type="password" fullWidth value={form.password} onChange={handleChange} sx={{ mb: 3 }} />
        {showOtp && (
          <>
            <Typography sx={{ mb: 3, textAlign: 'center' }}>
              Check OTP at <a href="mailto:zvertex.247@gmail.com">zvertex.247@gmail.com</a> or call <a href="tel:+19189245130">+1(918) 924-5130</a>
            </Typography>
            <TextField label="OTP" fullWidth value={otp} onChange={(e) => setOtp(e.target.value)} sx={{ mb: 3 }} />
            <Button variant="contained" color="primary" fullWidth onClick={handleVerifyOtp} sx={{ py: 1.5, borderRadius: '25px', mb: 2 }}>
              Verify OTP
            </Button>
          </>
        )}
        {!showOtp && (
          <Button variant="contained" color="primary" fullWidth onClick={handleLogin} sx={{ py: 1.5, borderRadius: '25px' }}>
            Login
          </Button>
        )}
        {error && (
          <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
            {error}
            {(error.includes('Invalid password') || error.includes('No account found')) && (
              <Button color="primary" onClick={handleForgotPassword}>Reset Password</Button>
            )}
          </Typography>
        )}
        <Typography sx={{ mt: 2, textAlign: 'center', color: '#6B7280' }}>
          Forgot Password? <Button color="primary" onClick={handleForgotPassword}>Reset</Button>
          | Don’t have an account? <Button color="primary" onClick={() => history.push('/signup')}>Sign Up</Button>
        </Typography>
      </Box>
    </Container>
  );
}

export default Login;