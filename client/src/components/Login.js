import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Typography, TextField, Button, Container, CircularProgress } from '@mui/material';
import axios from 'axios';

function Login({ setUser }) {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL || 'https://zvertexai-orzv.onrender.com';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${apiUrl}/api/auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      history.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', py: 8 }}>
      <Container maxWidth="sm">
        <Box sx={{ backgroundColor: 'rgba(255,255,255,0.1)', p: 4, borderRadius: '15px', textAlign: 'center' }}>
          <Typography variant="h4" sx={{ color: 'white', mb: 4, fontWeight: 'bold' }}>
            Login to ZvertexAI
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                mb: 3,
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
                mb: 3,
                input: { color: 'white' },
                label: { color: 'white' },
                '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } },
              }}
            />
            {error && (
              <Typography color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' }, py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
            </Button>
          </form>
          <Typography sx={{ color: 'white', mt: 2 }}>
            Forgot password?{' '}
            <span style={{ color: '#ff6d00', cursor: 'pointer' }} onClick={() => history.push('/forgot-password')}>
              Reset it
            </span>
          </Typography>
          <Typography sx={{ color: 'white', mt: 1 }}>
            Don't have an account?{' '}
            <span style={{ color: '#ff6d00', cursor: 'pointer' }} onClick={() => history.push('/register')}>
              Sign up
            </span>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Login;