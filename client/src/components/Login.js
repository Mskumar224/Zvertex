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

function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();
  const apiUrl = process.env.REACT_APP_API_URL || 'https://zvertexai-orzv.onrender.com';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post(`${apiUrl}/api/auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      const userRes = await axios.get(`${apiUrl}/api/auth`, {
        headers: { 'x-auth-token': res.data.token },
      });
      setUser(userRes.data);
      history.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#121212', color: 'white', py: 4 }}>
      <Container maxWidth="sm">
        <IconButton
          onClick={() => history.push('/')}
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
            Login
          </Typography>
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
            <TextField
              label="Password"
              fullWidth
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              Login
            </Button>
          </Box>
          <Typography sx={{ mt: 2 }}>
            Forgot{' '}
            <Button
              sx={{ color: '#00e676', textTransform: 'none' }}
              onClick={() => history.push('/forgot-password')}
            >
              Password?
            </Button>
          </Typography>
          <Typography>
            Need an account?{' '}
            <Button
              sx={{ color: '#00e676', textTransform: 'none' }}
              onClick={() => history.push('/register')}
            >
              Register
            </Button>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}

export default Login;