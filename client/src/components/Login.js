import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Typography, TextField, Button, Container, Grid } from '@mui/material';
import axios from 'axios';

function Login({ setUser, user }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();
  const apiUrl = process.env.REACT_APP_API_URL || 'https://zvertexai-orzv.onrender.com';

  useEffect(() => {
    let mounted = true;

    if (user) {
      history.push('/dashboard');
    } else {
      const token = localStorage.getItem('token');
      if (token) {
        axios
          .get(`${apiUrl}/api/auth/me`, {
            headers: { 'x-auth-token': token },
          })
          .then((res) => {
            if (mounted) {
              setUser(res.data);
              history.push('/dashboard');
            }
          })
          .catch(() => {
            if (mounted) {
              localStorage.removeItem('token');
            }
          });
      }
    }

    return () => {
      mounted = false;
    };
  }, [user, history, setUser, apiUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${apiUrl}/api/auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      setEmail('');
      setPassword('');
      history.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', color: 'white' }}>
      <Container maxWidth="sm">
        <Box sx={{ mt: 4, mb: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
            Login
          </Typography>
          <Box sx={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '15px', p: 3, width: '100%' }}>
            {error && <Typography color="error">{error}</Typography>}
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
              <TextField
                label="Password"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                Login
              </Button>
            </Box>
            <Button
              variant="text"
              onClick={() => history.push('/forgot-password')}
              sx={{ mt: 2, color: 'white' }}
            >
              Forgot Password?
            </Button>
            <Button
              variant="text"
              onClick={() => history.push('/register')}
              sx={{ mt: 1, color: 'white' }}
            >
              Don't have an account? Register
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
                 generally, how can I troubleshoot these errors? Contact Us
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

export default Login;