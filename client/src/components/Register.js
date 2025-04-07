import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Typography, TextField, Button, Container, Paper, Grid, Divider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';

function Register({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();
  const apiUrl = process.env.REACT_APP_API_URL || 'https://zvertexai-orzv.onrender.com';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${apiUrl}/api/auth/register`, { email, password });
      localStorage.setItem('token', res.data.token);
      setUser({ email: res.data.email, subscriptionType: res.data.subscriptionType });
      history.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', color: 'white' }}>
      <Container maxWidth="sm">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => history.goBack()}
          sx={{ mt: 2, color: '#ff6d00' }}
        >
          Back
        </Button>
        <Paper elevation={6} sx={{ mt: 4, p: 4, borderRadius: '15px', backgroundColor: 'rgba(255,255,255,0.1)' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>Register</Typography>
            {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <TextField
                label="Email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
                sx={{ 
                  mb: 2, 
                  input: { color: 'white' }, 
                  label: { color: '#b0b0b0' }, 
                  '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#ff6d00' } } 
                }}
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="outlined"
                sx={{ 
                  mb: 3, 
                  input: { color: 'white' }, 
                  label: { color: '#b0b0b0' }, 
                  '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#ff6d00' } } 
                }}
              />
              <Button 
                type="submit" 
                variant="contained" 
                fullWidth 
                sx={{ 
                  mb: 2, 
                  backgroundColor: '#ff6d00', 
                  '&:hover': { backgroundColor: '#e65100' }, 
                  borderRadius: '25px', 
                  py: 1.5 
                }}
              >
                Register
              </Button>
              <Button 
                variant="text" 
                sx={{ color: '#00e676' }} 
                onClick={() => history.push('/login')}
              >
                Already have an account? Login
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>

      <Box sx={{ py: 4, backgroundColor: '#1a2a44', textAlign: 'center', mt: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>ZvertexAI</Typography>
              <Typography variant="body2">
                Empowering careers and businesses with AI-driven solutions.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Quick Links</Typography>
              <Typography variant="body2" sx={{ cursor: 'pointer' }} onClick={() => history.push('/contact')}>
                Contact Us
              </Typography>
              <Typography variant="body2" sx={{ cursor: 'pointer' }} onClick={() => history.push('/faq')}>
                Interview FAQs
              </Typography>
              <Typography variant="body2" sx={{ cursor: 'pointer' }} onClick={() => history.push('/why-us')}>
                Why ZvertexAI?
              </Typography>
              <Typography variant="body2" sx={{ cursor: 'pointer' }} onClick={() => history.push('/zgpt')}>
                ZGPT Copilot
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Contact</Typography>
              <Typography variant="body2">5900 Balcones Dr #16790, Austin, TX 78731</Typography>
              <Typography variant="body2">Phone: 737-239-0920 (151)</Typography>
              <Typography variant="body2">Email: support@zvertexai.com</Typography>
            </Grid>
          </Grid>
          <Divider sx={{ my: 2, backgroundColor: '#fff' }} />
          <Typography variant="body2">
            © 2025 ZvertexAI. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default Register;