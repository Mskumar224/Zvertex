import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Link } from '@mui/material';
import axios from 'axios';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Sending POST to /api/auth/forgot-password:', { email });
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/forgot-password`, { email });
      setMessage(response.data.message);
      setError('');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to send reset link';
      setError(errorMessage);
      setMessage('');
      console.error('Forgot password error:', errorMessage, {
        status: err.response?.status,
        data: err.response?.data
      });
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        py: 4,
        ml: { xs: 0, md: '260px' },
        display: 'flex',
        justifyContent: 'center',
        minHeight: '100vh',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          p: { xs: 3, sm: 4 },
          background: '#fff',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: 400,
          transition: 'all 0.3s ease',
        }}
      >
        <Typography
          variant="h4"
          align="center"
          sx={{ color: '#1976d2', mb: 3, fontWeight: 600 }}
        >
          ZvertexAI - Forgot Password
        </Typography>
        {message && (
          <Typography sx={{ color: '#115293', mb: 2, textAlign: 'center', fontSize: '0.9rem' }}>
            {message}
          </Typography>
        )}
        {error && (
          <Typography sx={{ color: 'error.main', mb: 2, textAlign: 'center', fontSize: '0.9rem' }}>
            {error}
          </Typography>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, py: 1.2, fontSize: '1rem' }}
          >
            Send Reset Link
          </Button>
          <Link
            href="/login"
            sx={{
              display: 'block',
              textAlign: 'center',
              mt: 2,
              color: '#1976d2',
              textDecoration: 'none',
              fontSize: '0.9rem',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Back to Login
          </Link>
        </form>
      </Box>
    </Container>
  );
}

export default ForgotPassword;