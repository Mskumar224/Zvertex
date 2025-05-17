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
  const [showOtpField, setShowOtpField] = useState(false); // Control OTP field visibility
  const [tempUserId, setTempUserId] = useState(null); // Store temporary user ID
  const [showForgotPassword, setShowForgotPassword] = useState(false); // Control forgot password form
  const [resetEmail, setResetEmail] = useState('');
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
      setTempUserId(res.data.userId);
      setShowOtpField(true); // Show OTP field on same page
      setError('Please enter the OTP sent to the company email');
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
        userId: tempUserId,
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

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!resetEmail) {
      setError('Email is required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await axios.post(`${apiUrl}/api/auth/forgot-password`, { email: resetEmail });
      setError('Password reset email sent. Check your inbox.');
      setShowForgotPassword(false);
      setResetEmail('');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to send password reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', py: 4 }}>
      <Container maxWidth="sm">
        <Box sx={{ backgroundColor: 'rgba(255,255,255,0.1)', p: 4, borderRadius: '15px' }}>
          <Typography variant="h4" sx={{ color: 'white', mb: 3, textAlign: 'center' }}>
            {isRegister ? 'Register' : showForgotPassword ? 'Reset Password' : 'Login'}
          </Typography>
          {error && <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>{error}</Typography>}
          {!isRegister && !showForgotPassword ? (
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
                Don't have an account?{' '}
                <Button sx={{ color: '#ff6d00' }} onClick={() => setIsRegister(true)}>
                  Register
                </Button>
              </Typography>
              <Typography sx={{ color: 'white', mt: 1, textAlign: 'center' }}>
                Forgot password?{' '}
                <Button sx={{ color: '#ff6d00' }} onClick={() => setShowForgotPassword(true)}>
                  Reset
                </Button>
              </Typography>
            </Box>
          ) : showForgotPassword ? (
            <Box component="form" onSubmit={handleForgotPasswordSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
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
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Send Reset Email'}
                  </Button>
                </Grid>
              </Grid>
              <Typography sx={{ color: 'white', mt: 2, textAlign: 'center' }}>
                Back to{' '}
                <Button sx={{ color: '#ff6d00' }} onClick={() => setShowForgotPassword(false)}>
                  Login
                </Button>
              </Typography>
            </Box>
          ) : (
            <Box component="form" onSubmit={showOtpField ? handleOtpSubmit : handleRegisterSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={showOtpField}
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
                    disabled={showOtpField}
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
                    disabled={showOtpField}
                    sx={{ input: { color: 'white' }, label: { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } } }}
                  />
                </Grid>
                {showOtpField && (
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
                )}
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' } }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : showOtpField ? 'Verify OTP' : 'Register'}
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
          )}
        </Box>
      </Container>
    </Box>
  );
}

export default Login;