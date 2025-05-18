import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleLogin = async () => {
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, { email, password });
      localStorage.setItem('token', data.token);
      alert(data.message);
      history.push('/dashboard');
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed! Please try again.');
      console.error('Login error:', error);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', py: { xs: 2, sm: 4 } }}>
      <Container maxWidth="sm">
        <Box sx={{ background: 'white', borderRadius: 2, boxShadow: 3, p: { xs: 2, sm: 4 } }}>
          <Typography variant="h4" gutterBottom align="center" sx={{ color: '#1a2a44', fontSize: { xs: '1.5rem', sm: '2rem' } }}>
            Login to ZvertexAI
          </Typography>
          <Box component="form" sx={{ mt: 3 }}>
            <TextField
              label="Email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 3 }}
              variant="outlined"
              required
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 3 }}
              variant="outlined"
              required
            />
            <Button
              variant="contained"
              sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' }, py: 1.5, fontSize: { xs: '0.875rem', sm: '1rem' } }}
              onClick={handleLogin}
              fullWidth
            >
              Login
            </Button>
          </Box>
          <Typography sx={{ mt: 2, textAlign: 'center', color: '#1a2a44', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
            Don't have an account? <Link to="/signup" style={{ color: '#ff6d00' }}>Sign Up</Link>
          </Typography>
          <Typography sx={{ mt: 1, textAlign: 'center', color: '#1a2a44', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
            Forgot password? <Link to="/forgot-password" style={{ color: '#ff6d00' }}>Reset Password</Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Login;