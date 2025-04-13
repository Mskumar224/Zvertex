import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  TextField,
  Button,
  Paper,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';

function ResetPassword() {
  const history = useHistory();
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const apiUrl = process.env.REACT_APP_API_URL || 'https://zvertexai-orzv.onrender.com';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    try {
      await axios.post(`${apiUrl}/api/auth/reset-password/${token}`, { password });
      setSuccess('Password reset successfully! Redirecting to login...');
      setTimeout(() => history.push('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to reset password.');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#121212', color: 'white', py: 4 }}>
      <Container maxWidth="sm">
        <IconButton
          onClick={() => history.push('/login')}
          sx={{ color: 'white', mb: 2 }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Paper
          sx={{
            p: 4,
            backgroundColor: '#1e1e1e',
            borderRadius: '15px',
            textAlign: 'center',
          }}
        >
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
            Reset Password
          </Typography>
          {success && (
            <Typography sx={{ color: '#00e676', mb: 2 }}>{success}</Typography>
          )}
          {error && (
            <Typography sx={{ color: '#ff1744', mb: 2 }}>{error}</Typography>
          )}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="New Password"
              fullWidth
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 3 }}
              required
            />
            <TextField
              label="Confirm Password"
              fullWidth
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              sx={{ mb: 3 }}
              required
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: '#ff6d00',
                '&:hover': { backgroundColor: '#e65100' },
                borderRadius: '10px',
                py: 1.5,
              }}
            >
              Reset Password
            </Button>
          </Box>
          <Typography sx={{ mt: 2 }}>
            Back to{' '}
            <Button
              sx={{ color: '#00e676', textTransform: 'none' }}
              onClick={() => history.push('/login')}
            >
              Login
            </Button>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}

export default ResetPassword;