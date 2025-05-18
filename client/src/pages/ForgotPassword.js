import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState('request');
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
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', py: { xs: 2, sm: 4 } }}>
      <Container maxWidth="sm">
        <Box sx={{ background: 'white', borderRadius: 2, boxShadow: 3, p: { xs: 2, sm: 4 } }}>
          <Typography variant="h4" gutterBottom align="center" sx={{ color: '#1a2a44', fontSize: { xs: '1.5rem', sm: '2rem' } }}>
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
                <Button
                  variant="contained"
                  sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' }, py: 1.5, fontSize: { xs: '0.875rem', sm: '1rem' } }}
                  onClick={handleRequest}
                  fullWidth
                >
                  Request OTP
                </Button>
              </>
            ) : (
              <>
                <Typography sx={{ mb: 2, color: '#1a2a44', fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                  An OTP has been sent to the ZvertexAI team. Please request your OTP, and our team will reach out to you soon over the provided phone or email.
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
                <Button
                  variant="contained"
                  sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' }, py: 1.5, fontSize: { xs: '0.875rem', sm: '1rem' } }}
                  onClick={handleReset}
                  fullWidth
                >
                  Reset Password
                </Button>
              </>
            )}
          </Box>
          <Typography sx={{ mt: 2, textAlign: 'center', color: '#1a2a44', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
            Back to <Link to="/login" style={{ color: '#ff6d00' }}>Login</Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default ForgotPassword;