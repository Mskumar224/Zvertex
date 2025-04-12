import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, TextField, Button, Container, Alert } from '@mui/material';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

function Login({ setUser, apiUrl }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await axios.post(`${apiUrl}/api/auth/login`, formData);
      if (isMounted.current) {
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        setSuccess('Login successful!');
        setTimeout(() => {
          if (isMounted.current) {
            history.push('/dashboard');
          }
        }, 1000);
      }
    } catch (err) {
      if (isMounted.current) {
        setError(err.response?.data?.msg || 'Login failed');
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  return (
    <Box sx={{
      minHeight: 'calc(100vh - 64px)',
      display: 'flex',
      alignItems: 'center',
      color: 'white',
    }}>
      <Container maxWidth="sm">
        <Box sx={{
          background: 'rgba(255, 255, 255, 0.1)',
          p: 4,
          borderRadius: '15px',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          transition: 'all 0.3s ease',
        }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ffffff', textAlign: 'center' }}>
            Login
          </Typography>
          {error && <Alert severity="error" sx={{ borderRadius: '10px' }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ borderRadius: '10px' }}>{success}</Alert>}
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              required
              sx={{
                '& .MuiInputBase-input': { color: 'white' },
                '& .MuiInputLabel-root': { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                  '&:hover fieldset': { borderColor: '#00e676' },
                  '&.Mui-focused fieldset': { borderColor: '#00e676' },
                },
              }}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              required
              sx={{
                '& .MuiInputBase-input': { color: 'white' },
                '& .MuiInputLabel-root': { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                  '&:hover fieldset': { borderColor: '#00e676' },
                  '&.Mui-focused fieldset': { borderColor: '#00e676' },
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                backgroundColor: '#ff6d00',
                '&:hover': { backgroundColor: '#e65100' },
                borderRadius: '25px',
                py: 1.5,
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
              }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Login;