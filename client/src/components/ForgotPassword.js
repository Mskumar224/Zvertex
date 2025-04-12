import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Typography, TextField, Button, Container, IconButton, Grid } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';

function ForgotPassword({ user }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const history = useHistory();
  const apiUrl = process.env.REACT_APP_API_URL || 'https://zvertexai-orzv.onrender.com';

  if (user) {
    history.push('/dashboard');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post(`${apiUrl}/api/auth/forgot-password`, { email });
      setSuccess('Password reset link sent to your email!');
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to send reset link');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', color: 'white' }}>
      <Container maxWidth="sm">
        <Box sx={{ mt: 4, mb: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 2 }}>
            <IconButton onClick={() => history.goBack()} sx={{ color: '#ff6d00' }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" sx={{ flexGrow: 1, textAlign: 'center', fontWeight: 'bold' }}>
              Forgot Password
            </Typography>
          </Box>
          <Box sx={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '15px', p: 3, width: '100%' }}>
            {error && <Typography color="error">{error}</Typography>}
            {success && <Typography sx={{ color: '#00e676' }}>{success}</Typography>}
            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <TextField
                label="Email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  mb: 2,
                  input: { color: 'white' },
                  label: { color: 'white' },
                  '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: '#ff6d00',
                  '&:hover': { backgroundColor: '#e65100' },
                  color: 'white',
                  borderRadius: '25px',
                  py: 1.5,
                }}
              >
                Send Reset Link
              </Button>
            </Box>
            <Button
              variant="text"
              onClick={() => history.push('/login')}
              sx={{ mt: 2, color: 'white' }}
            >
              Back to Login
            </Button>
          </Box>
        </Box>
      </Container>
      <Box sx={{ py: 4, backgroundColor: '#1a2a44', color: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>About ZvertexAI</Typography>
              <Typography variant="body2">
                ZvertexAI empowers your career with AI-driven job matching, innovative projects, and ZGPT, your personal copilot.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Quick Links</Typography>
              <Box>
                <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer' }} onClick={() => history.push('/faq')}>
                  Interview FAQs
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer' }} onClick={() => history.push('/why-us')}>
                  Why ZvertexAI?
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer' }} onClick={() => history.push('/zgpt')}>
                  ZGPT Copilot
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer' }} onClick={() => history.push('/contact')}>
                  Contact Us
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Contact Us</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Address: 5900 Balcones Dr #16790, Austin, TX 78731
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Phone: (737) 239-0920
              </Typography>
              <Typography variant="body2">
                Email: support@zvertexai.com
              </Typography>
            </Grid>
          </Grid>
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2">
              © 2025 ZvertexAI. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default ForgotPassword;