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
    if (!email || !password || !name || !subscriptionType) {
      setError('Please fill all required fields');
      return;
    }
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/signup`, {
        email,
        password,
        name,
        phone,
        subscriptionType
      });
      setUserId(data.userId);
      setStep('otp');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setError('Please enter the OTP');
      return;
    }
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/verify-otp`, { userId, otp });
      localStorage.setItem('token', data.token);
      history.push('/subscription');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed');
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
              error={!!error && !name}
            />
            <TextField
              label="Email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 3 }}
              variant="outlined"
              error={!!error && !email}
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
              error={!!error && !password}
            />
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Subscription Type</InputLabel>
              <Select
                value={subscriptionType}
                onChange={(e) => setSubscriptionType(e.target.value)}
                label="Subscription Type"
                error={!!error && !subscriptionType}
              >
                <MenuItem value="STUDENT">Student</MenuItem>
                <MenuItem value="RECRUITER">Recruiter</MenuItem>
                <MenuItem value="BUSINESS">Business</MenuItem>
              </Select>
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
              error={!!error && !otp}
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