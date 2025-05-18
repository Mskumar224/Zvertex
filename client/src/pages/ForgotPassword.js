import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState('request'); // 'request' or 'reset'
  const history = useHistory();

  const handleRequest = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/forgot-password`, { email });
      alert(response.data.message);
      setStep('reset');
    } catch (error) {
      alert(error.response?.data?.message || 'Request failed!');
    }
  };

  const handleReset = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/reset-password`, { email, otp, newPassword });
      alert(response.data.message);
      history.push('/login');
    } catch (error) {
      alert(error.response?.data?.message || 'Password reset failed!');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 5, background: '#fff', borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ color: '#1976d2' }}>
        {step === 'request' ? 'Forgot Password' : 'Reset Password'}
      </Typography>
      <Box component="form" sx={{ mt: 3 }}>
        {step === 'request' ? (
          <>
            <TextField
              label="Email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 3 }}
              variant="outlined"
            />
            <Button variant="contained" color="primary" onClick={handleRequest} fullWidth sx={{ py: 1.5 }}>
              Request OTP
            </Button>
          </>
        ) : (
          <>
            <Typography sx={{ mb: 2 }}>
              A reset OTP has been sent to the ZvertexAI team (zvertex.247@gmail.com). Please request your OTP and enter it below.
            </Typography>
            <TextField
              label="OTP"
              fullWidth
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              sx={{ mb: 3 }}
              variant="outlined"
            />
            <TextField
              label="New Password"
              type="password"
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              sx={{ mb: 3 }}
              variant="outlined"
            />
            <Button variant="contained" color="primary" onClick={handleReset} fullWidth sx={{ py: 1.5 }}>
              Reset Password
            </Button>
          </>
        )}
      </Box>
      <Typography sx={{ mt: 2, textAlign: 'center' }}>
        Back to <Link to="/login">Login</Link>
      </Typography>
    </Container>
  );
}

export default ForgotPassword;