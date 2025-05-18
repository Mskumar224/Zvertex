import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';

function Signup() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('signup');
  const history = useHistory();

  const handleSignup = async () => {
    if (!email || !phone || !password) {
      alert('Please provide email, phone, and password.');
      return;
    }
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/signup`, { email, phone, password });
      alert(response.data.message);
      setStep('verify');
    } catch (error) {
      alert(error.response?.data?.message || 'Signup failed! Please try again.');
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
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', py: 4 }}>
      <Container maxWidth="sm">
        <Box sx={{ background: 'white', borderRadius: 2, boxShadow: 3, p: 4 }}>
          <Typography variant="h4" gutterBottom align="center" sx={{ color: '#1a2a44' }}>
            {step === 'signup' ? 'Create Your ZvertexAI Account' : 'Verify OTP'}
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
                  required
                />
                <TextField
                  label="Phone Number"
                  fullWidth
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  sx={{ mb: 3 }}
                  variant="outlined"
                  required
                />
                <TextField
                  label="Password"
                  type="password"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{ mb: 3 }}
                  variant="outlined"
                  required
                />
                <Button
                  variant="contained"
                  sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' }, py: 1.5 }}
                  onClick={handleSignup}
                  fullWidth
                >
                  Sign Up
                </Button>
              </>
            ) : (
              <>
                <Typography sx={{ mb: 2, color: '#1a2a44' }}>
                  An OTP has been sent to the ZvertexAI team (zvertex.247@gmail.com). Please request your OTP and enter it below.
                </Typography>
                <TextField
                  label="OTP"
                  fullWidth
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  sx={{ mb: 3 }}
                  variant="outlined"
                />
                <Button
                  variant="contained"
                  sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' }, py: 1.5 }}
                  onClick={handleVerify}
                  fullWidth
                >
                  Verify OTP
                </Button>
              </>
            )}
          </Box>
          <Typography sx={{ mt: 2, textAlign: 'center', color: '#1a2a44' }}>
            Already have an account? <Link to="/login" style={{ color: '#ff6d00' }}>Login</Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Signup;