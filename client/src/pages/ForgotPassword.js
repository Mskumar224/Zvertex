import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';
import { useHistory, Link } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const history = useHistory();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/forgot-password`, { email });
      setError('');
      setSuccess('A password reset link has been sent to your email.');
    } catch (error) {
      console.error('Forgot password error:', error.response?.data?.error || error.message);
      setError(error.response?.data?.error || 'Failed to send reset link. Please try again.');
      setSuccess('');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Box sx={{ bgcolor: '#fff', p: 4, borderRadius: 2, boxShadow: 3 }}>
        <Button
          onClick={() => history.push('/')}
          sx={{ mb: 3, color: '#fff', bgcolor: '#00e676', '&:hover': { bgcolor: '#00c853' } }}
        >
          Back
        </Button>
        <Typography variant="h4" gutterBottom align="center">
          Reset Your Password
        </Typography>
        <Typography sx={{ mb: 3, textAlign: 'center' }}>
          Enter your email address to receive a password reset link.
        </Typography>
        <Box component="form" sx={{ mt: 3 }}>
          <TextField
            label="Email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 3 }}
            variant="outlined"
          />
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          {success && (
            <Typography color="success" sx={{ mb: 2 }}>
              {success}
            </Typography>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            fullWidth
            sx={{ py: 1.5 }}
          >
            Send Reset Link
          </Button>
        </Box>
        <Typography sx={{ mt: 2, textAlign: 'center' }}>
          Remember your password? <Link to="/login">Login</Link>
        </Typography>
      </Box>
    </Container>
  );
}

export default ForgotPassword;