import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axios from 'axios';
import { useHistory, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [openOtpModal, setOpenOtpModal] = useState(false);
  const history = useHistory();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, { email, password });
      localStorage.setItem('token', data.token);
      history.push('/student-dashboard');
    } catch (error) {
      console.error('Login error:', error.response?.data?.error || error.message);
      if (error.response?.data?.code === 'pending_otp') {
        setError('Your account is pending OTP approval. Please verify the OTP sent to ZvertexAI.');
        setOpenOtpModal(true);
      } else {
        setError(error.response?.data?.error || 'Login failed. Please check your email and password.');
      }
    }
  };

  const handleOtpVerification = async () => {
    if (!otp) {
      setOtpError('Please enter the OTP.');
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/verify-otp`, { email, otp });
      setOtpError('');
      setOpenOtpModal(false);
      // Retry login
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, { email, password });
      localStorage.setItem('token', data.token);
      history.push('/student-dashboard');
    } catch (error) {
      console.error('OTP verification error:', error.response?.data?.error || error.message);
      setOtpError(error.response?.data?.error || 'OTP verification failed. Please try again or resend OTP.');
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      setOtpError('Please enter your email to resend OTP.');
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/resend-otp`, { email });
      setOtpError('');
      alert('New OTP sent to ZvertexAI. Please contact ZvertexAI at zvertex.247@gmail.com to receive it.');
    } catch (error) {
      console.error('Resend OTP error:', error.response?.data?.error || error.message);
      setOtpError(error.response?.data?.error || 'Failed to resend OTP. Please try again.');
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
          Login to Your Account
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
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            onClick={handleLogin}
            fullWidth
            className="back-button"
            sx={{ py: 1.5 }}
          >
            Login
          </Button>
        </Box>
        <Typography sx={{ mt: 2, textAlign: 'center' }}>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </Typography>
      </div>

      {/* OTP Verification Modal */}
      <Dialog open={openOtpModal} onClose={() => setOpenOtpModal(false)}>
        <DialogTitle>Verify OTP</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2, fontWeight: 'bold', color: '#007BFF' }}>
            Reach out to ZvertexAI to approve your OTP
          </Typography>
          <Typography sx={{ mb: 2 }}>
            An OTP has been sent to ZvertexAI (zvertex.247@gmail.com) for approval. Please contact ZvertexAI to receive your one-time verification OTP.
          </Typography>
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
          {otpError && (
            <Typography color="error" sx={{ mb: 2 }}>
              {otpError}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleResendOtp} color="primary">
            Resend OTP
          </Button>
          <Button onClick={handleOtpVerification} color="primary" variant="contained">
            Verify OTP
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Login;