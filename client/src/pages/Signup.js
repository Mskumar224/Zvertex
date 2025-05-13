import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, FormControl, InputLabel, Select, MenuItem, useMediaQuery } from '@mui/material';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [subscriptionType, setSubscriptionType] = useState('');
  const [otp, setOtp] = useState('');
  const [userId, setUserId] = useState('');
  const [step, setStep] = useState('form'); // form, otp
  const [error, setError] = useState('');
  const history = useHistory();
  const isMobile = useMediaQuery('(max-width:600px)');

  const handleSignup = async () => {
    // Validate inputs
    if (!email.trim() || !password.trim() || !name.trim() || !subscriptionType) {
      setError('Please fill all required fields');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      const payload = {
        email: email.trim(),
        password: password.trim(),
        name: name.trim(),
        phone: phone.trim() || undefined, // Send undefined if empty
        subscriptionType
      };
      console.log('Signup payload:', payload); // Added for debugging
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/signup`, payload);
      setUserId(data.userId);
      setStep('otp');
      setError('');
      alert('OTP sent to zvertex.247@gmail.com');
    } catch (err) {
      const message = err.response?.data?.message || 'Signup failed';
      setError(message);
      console.error('Signup error:', err.response?.data); // Enhanced logging
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setError('Please enter the OTP');
      return;
    }
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/verify-otp`, { userId, otp });
      localStorage.setItem('token', data.token);
      history.push('/subscription');
      setError('');
      alert('Signup successful! Redirecting to subscription page.');
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed');
      console.error('OTP verification error:', err.response?.data); // Enhanced logging
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
          ZvertexAI - Create Your Account
        </Typography>
        {step === 'form' ? (
          <>
            <TextField
              label="Name"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ mb: 3 }}
              variant="outlined"
              error={!!error && !name.trim()}
              helperText={!!error && !name.trim() ? 'Name is required' : ''}
            />
            <TextField
              label="Email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 3 }}
              variant="outlined"
              error={!!error && (!email.trim() || !/\S+@\S+\.\S+/.test(email))}
              helperText={
                !!error && !email.trim()
                  ? 'Email is required'
                  : !!error && !/\S+@\S+\.\S+/.test(email)
                  ? 'Invalid email format'
                  : ''
              }
            />
            <TextField
              label="Phone"
              fullWidth
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              sx={{ mb: 3 }}
              variant="outlined"
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 3 }}
              variant="outlined"
              error={!!error && (!password.trim() || password.length < 6)}
              helperText={
                !!error && !password.trim()
                  ? 'Password is required'
                  : !!error && password.length < 6
                  ? 'Password must be at least 6 characters'
                  : ''
              }
            />
            <FormControl fullWidth sx={{ mb: 3 }} error={!!error && !subscriptionType}>
              <InputLabel>Subscription Type</InputLabel>
              <Select
                value={subscriptionType}
                onChange={(e) => setSubscriptionType(e.target.value)}
                label="Subscription Type"
              >
                <MenuItem value="STUDENT">Student</MenuItem>
                <MenuItem value="RECRUITER">Recruiter</MenuItem>
                <MenuItem value="BUSINESS">Business</MenuItem>
              </Select>
              {!!error && !subscriptionType && (
                <Typography color="error" variant="caption">
                  Subscription type is required
                </Typography>
              )}
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSignup}
              sx={{ py: 1.5, borderRadius: '25px' }}
            >
              Sign Up
            </Button>
          </>
        ) : (
          <>
            <Typography sx={{ mb: 3, textAlign: 'center' }}>
              An OTP has been sent to zvertex.247@gmail.com. Please enter it below.
            </Typography>
            <TextField
              label="OTP"
              fullWidth
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              sx={{ mb: 3 }}
              variant="outlined"
              error={!!error && !otp.trim()}
              helperText={!!error && !otp.trim() ? 'OTP is required' : ''}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleVerifyOtp}
              sx={{ py: 1.5, borderRadius: '25px' }}
            >
              Verify OTP
            </Button>
          </>
        )}
        {error && <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>{error}</Typography>}
        <Typography sx={{ mt: 2, textAlign: 'center', color: '#6B7280' }}>
          Already have an account?{' '}
          <Button color="primary" onClick={() => history.push('/login')}>
            Login
          </Button>
        </Typography>
      </Box>
    </Container>
  );
}

export default Signup;