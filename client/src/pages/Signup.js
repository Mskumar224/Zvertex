import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('signup'); // 'signup' or 'verify'
  const history = useHistory();

  const handleSignup = async () => {
    if (!email || !password) {
      alert('Please provide both email and password.');
      return;
    }
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/signup`, { email, password });
      alert(response.data.message);
      setStep('verify');
    } catch (error) {
      alert(error.response?.data?.message || 'Signup failed! Please check the server URL and try again.');
    }
  };

  const handleVerify = async () => {
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/verify-otp`, { email, otp });
      localStorage.setItem('token', data.token);
      alert(data.message);
      history.push('/subscription');
    } catch (error) {
      alert(error.response?.data?.message || 'OTP verification failed!');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 5, background: '#fff', borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ color: '#1976d2' }}>
        {step === 'signup' ? 'Create Your Account' : 'Verify OTP'}
      </Typography>
      <Box component="form" sx={{ mt: 3 }}>
        {step === 'signup' ? (
          <>
            <TextField
              label="Email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            />
            <Button variant="contained" color="primary" onClick={handleSignup} fullWidth sx={{ py: 1.5 }}>
              Sign Up
            </Button>
          </>
        ) : (
          <>
            <Typography sx={{ mb: 2 }}>
              An OTP has been sent to the Zvertex team (zvertex.247@gmail.com). Please request your OTP and enter it below.
            </Typography>
            <TextField
              label="OTP"
              fullWidth
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              sx={{ mb: 3 }}
              variant="outlined"
            />
            <Button variant="contained" color="primary" onClick={handleVerify} fullWidth sx={{ py: 1.5 }}>
              Verify OTP
            </Button>
          </>
        )}
      </Box>
      <Typography sx={{ mt: 2, textAlign: 'center' }}>
        Already have an account? <Link to="/login">Login</Link>
      </Typography>
    </Container>
  );
}

export default Signup;