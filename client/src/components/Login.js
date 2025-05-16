import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Typography, TextField, Button, Container, Grid, CircularProgress } from '@mui/material';
import axios from 'axios';

function Login({ setUser }) {
  const history = useHistory();
  const [formData, setFormData] = useState({ email: '', password: '', phone: '' });
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [registrationStep, setRegistrationStep] = useState('form'); // 'form' or 'otp'
  const [tempUserData, setTempUserData] = useState(null); // Store user data during OTP step
  const apiUrl = process.env.REACT_APP_API_URL || 'https://zvertexai-orzv.onrender.com';

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${apiUrl}/api/auth/login`, formData);
      localStorage.setItem('token', res.data.token);
      setUser(res.data);
      history.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.phone) {
      setError('All fields are required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${apiUrl}/api/auth/register`, formData);
      setTempUserData(res.data); // Store temporary user data
      setRegistrationStep('otp'); // Move to OTP step
      setError('Please enter the OTP provided by the company');
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otp) {
      setError('OTP is required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${apiUrl}/api/auth/verify-otp`, {
        userId: tempUserData.userId,
        otp,
      });
      localStorage.setItem('token', res.data.token);
      setUser(res.data);
      history.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', py: 4 }}>
      <Container maxWidth="sm">
        <Box sx={{ backgroundColor: 'rgba(255,255,255,0.1)', p: 4, borderRadius: '15px' }}>
          <Typography variant="h4" sx={{ color: 'white', mb: 3, textAlign: 'center' }}>
            {isRegister ? 'Register' : 'Login'}
          </Typography>
          {error && <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>{error}</Typography>}
          {!isRegister ? (
            <Box component="form" onSubmit={handleLoginSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    sx={{ input: { color: 'white' }, label: { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    sx={{ input: { color: 'white' }, label: { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' } }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
                  </Button>
                </Grid>
              </Grid>
              <Typography sx={{ color: 'white', mt: 2, textAlign: 'center' }}>
                Don&apos;t have an account?{' '}
                <Button sx={{ color: '#ff6d00' }} onClick={() => setIsRegister(true)}>
                  Register
                </Button>
              </Typography>
              <Typography sx={{ color: 'white', mt: 1, textAlign: 'center' }}>
                Forgot password?{' '}
                <Button sx={{ color: '#ff6d00' }} onClick={() => history.push('/forgot-password')}>
                  Reset
                </Button>
              </Typography>
            </Box>
          ) : registrationStep === 'form' ? (
            <Box component="form" onSubmit={handleRegisterSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    sx={{ input: { color: 'white' }, label: { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    sx={{ input: { color: 'white' }, label: { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Phone Number"
                    type="tel"
                    fullWidth
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    sx={{ input: { color: 'white' }, label: { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' } }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
                  </Button>
                </Grid>
              </Grid>
              <Typography sx={{ color: 'white', mt: 2, textAlign: 'center' }}>
                Already have an account?{' '}
                <Button sx={{ color: '#ff6d00' }} onClick={() => setIsRegister(false)}>
                  Login
                </Button>
              </Typography>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleOtpSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography sx={{ color: 'white', mb: 2, textAlign: 'center' }}>
                    Contact the company to obtain your OTP
                  </Typography>
                  <TextField
                    label="Enter OTP"
                    fullWidth
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    sx={{ input: { color: 'white' }, label: { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' } }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify OTP'}
                  </Button>
                </Grid>
              </Grid>
              <Typography sx={{ color: 'white', mt: 2, textAlign: 'center' }}>
                Back to registration?{' '}
                <Button sx={{ color: '#ff6d00' }} onClick={() => setRegistrationStep('form')}>
                  Register
                </Button>
              </Typography>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}

export default Login;