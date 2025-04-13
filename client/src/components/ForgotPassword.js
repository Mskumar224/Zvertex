import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
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

function ForgotPassword() {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const apiUrl = process.env.REACT_APP_API_URL || 'https://zvertexai-orzv.onrender.com';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post(`${apiUrl}/api/auth/forgot-password`, { email });
      setSuccess('Password reset link sent to your email.');
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to send reset link.');
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
            Forgot Password
          </Typography>
          {success && (
            <Typography sx={{ color: '#00e676', mb: 2 }}>{success}</Typography>
          )}
          {error && (
            <Typography sx={{ color: '#ff1744', mb: 2 }}>{error}</Typography>
          )}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Email"
              fullWidth
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              Send Reset Link
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

export default ForgotPassword;