import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Typography, TextField, Button, AppBar, Toolbar, Container } from '@mui/material';
import axios from 'axios';

function Login({ user, setUser }) {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      setUser({ email: res.data.email, subscriptionType: res.data.subscriptionType });
      history.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed.');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', color: 'white' }}>
      <AppBar position="static" sx={{ backgroundColor: 'rgba(26, 42, 68, 0.9)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
        <Toolbar>
          <Typography
            variant="h5"
            sx={{ flexGrow: 1, fontWeight: 'bold', cursor: 'pointer', color: '#ffffff' }}
            onClick={() => history.push('/')}
          >
            ZvertexAI
          </Typography>
          {!user && (
            <>
              <Button sx={{ color: '#ffffff' }} onClick={() => history.push('/register')}>
                Register
              </Button>
              <Button sx={{ color: '#ffffff' }} onClick={() => history.push('/forgot-password')}>
                Forgot Password
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ pt: 8 }}>
        <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ input: { color: 'white' }, label: { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } } }}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ input: { color: 'white' }, label: { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } } }}
          />
          {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3, backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' } }}
          >
            Login
          </Button>
        </form>
      </Container>
    </Box>
  );
}

export default Login;