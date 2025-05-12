import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';
import { useHistory, useParams, Link } from 'react-router-dom';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const history = useHistory();
  const { token } = useParams();

  const handleSubmit = async () => {
    if (!password) {
      setError('Please enter a new password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/reset-password/${token}`, { password });
      setError('');
      setSuccess('Password reset successfully. You can now log in.');
      setTimeout(() => history.push('/login'), 3000);
    } catch (error) {
      console.error('Reset password error:', error.response?.data?.error || error.message);
      setError(error.response?.data?.error || 'Failed to reset password. The link may be invalid or expired.');
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
          Enter your new password below.
        </Typography>
        <Box component="form" sx={{ mt: 3 }}>
          <TextField
            label="New Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            Reset Password
          </Button>
        </Box>
        <Typography sx={{ mt: 2, textAlign: 'center' }}>
          Return to <Link to="/login">Login</Link>
        </Typography>
      </Box>
    </Container>
  );
}

export default ResetPassword;