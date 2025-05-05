import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';
import { useHistory, Link } from 'react-router-dom';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const history = useHistory();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignup = async () => {
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/signup`, { email, password });
      setIsOtpSent(true);
      setError('');
      alert('Signup request sent. Please check with ZvertexAI for your OTP approval.');
    } catch (error) {
      console.error('Signup error:', error.response?.data?.error || error.message);
      setError(error.response?.data?.error || 'Signup failed. Please try again.');
    }
  };

  const handleOtpVerification = async () => {
    if (!otp) {
      setError('Please enter the OTP.');
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/verify-otp`, { email, otp });
      alert('OTP verified! You can now log in.');
      history.push('/login');
    } catch (error) {
      console.error('OTP verification error:', error.response?.data?.error || error.message);
      setError(error.response?.data?.error || 'OTP verification failed. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 5 }} className="zgpt-container">
      <div className="card">
        <Button
          onClick={() => history.push('/')}
          sx={{
            mb: 3,
            color: 'white',
            backgroundColor: '#00e676',
            '&:hover': { backgroundColor: '#00c853' },
          }}
          className="back-button"
        >
          Back
        </Button>
        <Typography variant="h4" gutterBottom align="center">
          Create Your Account
        </Typography>
        {!isOtpSent ? (
          <Box component="form" sx={{ mt: 3 }}>
            <TextField
              label="Email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                mb: 3,
                '& .MuiInputBase-input': { color: '#000000 !important' }, // Black text
                '& .MuiInputLabel-root': { color: '#333333 !important' }, // Dark gray label
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#333333' },
                  '&:hover fieldset': { borderColor: '#000000' },
                  '&.Mui-focused fieldset': { borderColor: '#000000' },
                },
              }}
              variant="outlined"
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                mb: 3,
                '& .MuiInputBase-input': { color: '#000000 !important' }, // Black text
                '& .MuiInputLabel-root': { color: '#333333 !important' }, // Dark gray label
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#333333' },
                  '&:hover fieldset': { borderColor: '#000000' },
                  '&.Mui-focused fieldset': { borderColor: '#000000' },
                },
              }}
              variant="outlined"
            />
            {error && (
              <Typography color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}
            <Button
              variant="contained"
              color="primary"
              onClick={handleSignup}
              fullWidth
              className="back-button"
              sx={{ py: 1.5 }}
            >
              Sign Up
            </Button>
          </Box>
        ) : (
          <Box sx={{ mt: 3 }}>
            <Typography sx={{ mb: 2 }}>
              An OTP has been sent to ZvertexAI for approval. Please enter the OTP provided by ZvertexAI.
            </Typography>
            <TextField
              label="OTP"
              fullWidth
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              sx={{
                mb: 3,
                '& .MuiInputBase-input': { color: '#000000 !important' }, // Black text
                '& .MuiInputLabel-root': { color: '#333333 !important' }, // Dark gray label
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#333333' },
                  '&:hover fieldset': { borderColor: '#000000' },
                  '&.Mui-focused fieldset': { borderColor: '#000000' },
                },
              }}
              variant="outlined"
            />
            {error && (
              <Typography color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}
            <Button
              variant="contained"
              color="primary"
              onClick={handleOtpVerification}
              fullWidth
              className="back-button"
              sx={{ py: 1.5 }}
            >
              Verify OTP
            </Button>
          </Box>
        )}
        <Typography sx={{ mt: 2, textAlign: 'center' }}>
          Already have an account? <Link to="/login">Login</Link>
        </Typography>
      </div>
    </Container>
  );
}

export default Signup;