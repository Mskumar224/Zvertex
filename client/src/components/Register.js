import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Typography, TextField, Button, AppBar, Toolbar, Container, MenuItem, Select } from '@mui/material';
import axios from 'axios';

function Register({ user, setUser }) {
  const history = useHistory();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [subscriptionType, setSubscriptionType] = useState('trial');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
        name,
        email,
        password,
        subscriptionType,
      });
      localStorage.setItem('token', res.data.token);
      setUser({ email: res.data.email, subscriptionType: res.data.subscriptionType });
      history.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed.');
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
              <Button sx={{ color: '#ffffff' }} onClick={() => history.push('/login')}>
                Login
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
          Register
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ input: { color: 'white' }, label: { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } } }}
          />
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
          <Select
            value={subscriptionType}
            onChange={(e) => setSubscriptionType(e.target.value)}
            fullWidth
            sx={{ color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' }, '& .MuiSvgIcon-root': { color: 'white' } }}
          >
            <MenuItem value="trial">Free Trial (7 Days)</MenuItem>
            <MenuItem value="student">Student ($69.99/Month)</MenuItem>
            <MenuItem value="recruiter">Recruiter ($149.99/Month)</MenuItem>
            <MenuItem value="business">Business ($249.99/Month)</MenuItem>
          </Select>
          {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3, backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' } }}
          >
            Register
          </Button>
        </form>
      </Container>
    </Box>
  );
}

export default Register;