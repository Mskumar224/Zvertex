import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';
import { useHistory, useLocation, Link } from 'react-router-dom';

function OtpVerification() {
  const history = useHistory();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleOtpVerification = async () => {
    if (!email || !otp) {
      setError('Please enter both email and OTP.');
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/verify-otp`, { email, otp });
      alert('OTP verified successfully! You can now log in without further approvals.');
      history.push('/login');
    } catch (error) {
      console.error('OTP verification error:', error.response?.data?.error || error.message);
      setError(error.response?.data?.error || 'OTP verification failed. Please try again or resend OTP.');
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      setError('Please enter your email to resend OTP.');
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/resend-otp`, { email });
      alert('New OTP sent to ZvertexAI. Please contact ZvertexAI at zvertex.247@gmail.com to receive it.');
      setError('');
    } catch (error) {
      console.error('Resend OTP error:', error.response?.data?.error || error.message);
      setError(error.response?.data?.error || 'Failed to resend OTP. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 5 }} className="zgpt-container">
      <div className="card">
        <Button
          onClick={() => history.push('/login')}
          sx={{
            mb: 3,
            color: 'white',
            backgroundColor: '#00e676',
            '&:hover': { backgroundColor: '#00c853' },
          }}
          className="back-button"
        >
          Back to Login
        </Button>
        <Typography variant="h4" gutterBottom align="center">
          Verify OTP
        </Typography>
        <Typography sx={{ mb: 2, textAlign: 'center' }}>
          An OTP has been sent to ZvertexAI (zvertex.247@gmail.com) for approval. Please contact ZvertexAI to receive your one-time verification OTP.
        </Typography>
        <Box component="form" sx={{ mt: 3 }}>
          <TextField
            label="Email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              mb: 3,
              '& .MuiInputBase-input': { color: '#000000 !important' },
              '& .MuiInputLabel-root': { color: '#333333 !important' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#333333' },
                '&:hover fieldset': { borderColor: '#000000' },
                '&.Mui-focused fieldset': { borderColor: '#000000' },
              },
            }}
            variant="outlined"
          />
          <TextField
            label="OTP"
            fullWidth
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            sx={{
              mb: 3,
              '& .MuiInputBase-input': { color: '#000000 !important' },
              '& .MuiInputLabel-root': { color: '#333333 !important' },
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
            sx={{ py: 1.5, mb: 2 }}
          >
            Verify OTP
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleResendOtp}
            fullWidth
            sx={{ py: 1.5 }}
          >
            Resend OTP
          </Button>
        </Box>
        <Typography sx={{ mt: 2, textAlign: 'center' }}>
          Ready to log in? <Link to="/login">Login</Link>
        </Typography>
      </div>
    </Container>
  );
}

export default OtpVerification;