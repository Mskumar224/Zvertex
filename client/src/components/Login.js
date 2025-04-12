import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Typography, TextField, Button, Container, Grid, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';

function Login({ user, setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const apiUrl = process.env.REACT_APP_API_URL || 'https://zvertexai-orzv.onrender.com';

  if (user) {
    history.push('/dashboard');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${apiUrl}/api/auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      setUser({ email: res.data.email, subscriptionType: res.data.subscriptionType });
      setError('');
      history.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)',
      color: 'white',
      py: 8,
    }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ff6d00' }}>
            Login
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{
            width: '100%',
            maxWidth: '400px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            p: 4,
            borderRadius: '15px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}>
            {error && <Alert severity="error" sx={{ borderRadius: '10px' }}>{error}</Alert>}
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#ff6d00' },
                  '&:hover fieldset': { borderColor: '#e65100' },
                  '&.Mui-focused fieldset': { borderColor: '#00e676' },
                },
                '& .MuiInputLabel-root': { color: 'white' },
                '& .MuiInputBase-input': { color: 'white' },
              }}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#ff6d00' },
                  '&:hover fieldset': { borderColor: '#e65100' },
                  '&.Mui-focused fieldset': { borderColor: '#00e676' },
                },
                '& .MuiInputLabel-root': { color: 'white' },
                '& .MuiInputBase-input': { color: 'white' },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                backgroundColor: '#ff6d00',
                '&:hover': { backgroundColor: '#e65100' },
                borderRadius: '25px',
                py: 1.5,
                fontWeight: 'bold',
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
            </Button>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
              <Button
                variant="text"
                sx={{ color: '#00e676', textTransform: 'none' }}
                onClick={() => history.push('/forgot-password')}
                disabled={loading}
              >
                Forgot Password?
              </Button>
              <Button
                variant="text"
                sx={{ color: '#00e676', textTransform: 'none' }}
                onClick={() => history.push('/register')}
                disabled={loading}
              >
                Don't have an account? Register
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
      <Box sx={{
        py: 4,
        mt: 8,
        backgroundColor: '#1a2a44',
        color: 'white',
        textAlign: 'center',
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#ff6d00' }}>
                About ZvertexAI
              </Typography>
              <Typography variant="body2" sx={{ color: 'white' }}>
                Empowering careers with AI-driven job matching and ZGPT copilot.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#ff6d00' }}>
                Quick Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button sx={{ color: '#00e676' }} onClick={() => history.push('/faq')}>Interview FAQs</Button>
                <Button sx={{ color: '#00e676' }} onClick={() => history.push('/why-us')}>Why ZvertexAI?</Button>
                <Button sx={{ color: '#00e676' }} onClick={() => history.push('/projects')}>Our Projects</Button>
                <Button sx={{ color: '#00e676' }} onClick={() => history.push('/contact-us')}>Contact Us</Button>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#ff6d00' }}>
                Contact Info
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, color: 'white' }}>
                Address: 5900 Balcones Dr #16790, Austin, TX 78731
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, color: 'white' }}>
                Phone: (737) 239-0920
              </Typography>
              <Typography variant="body2" sx={{ color: 'white' }}>
                Email: support@zvertexai.com
              </Typography>
            </Grid>
          </Grid>
          <Typography variant="body2" sx={{ mt: 4, color: 'white' }}>
            © 2025 ZvertexAI. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default Login;