import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Container, MenuItem } from '@mui/material';
import axios from 'axios';

function Register({ setUser }) {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [subscriptionPlan, setSubscriptionPlan] = useState('Basic');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5002'}/api/auth/register`,
        { name, email, password, subscriptionPlan }
      );
      localStorage.setItem('token', res.data.token);
      const userRes = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5002'}/api/auth/user`,
        { headers: { 'x-auth-token': res.data.token } }
      );
      setUser(userRes.data);
      navigate('/dashboard');
    } catch (err) {
      alert('Error: ' + (err.response?.data?.msg || 'Registration failed'));
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#1a2a44', color: 'white', pt: 8 }}>
      <Container maxWidth="sm">
        <Typography variant="h4" sx={{ mb: 4 }}>
          Register
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{
              mb: 2,
              input: { color: 'white' },
              label: { color: 'white' },
              '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } },
            }}
          />
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
          <TextField
            select
            label="Subscription Plan"
            fullWidth
            value={subscriptionPlan}
            onChange={(e) => setSubscriptionPlan(e.target.value)}
            sx={{
              mb: 2,
              input: { color: 'white' },
              label: { color: 'white' },
              '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } },
            }}
          >
            <MenuItem value="Basic">Basic</MenuItem>
            <MenuItem value="Pro">Pro</MenuItem>
            <MenuItem value="Enterprise">Enterprise</MenuItem>
          </TextField>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' } }}
          >
            Register
          </Button>
        </form>
        <Button
          sx={{ mt: 2, color: '#00e676' }}
          onClick={() => navigate('/login')}
        >
          Already have an account? Login
        </Button>
      </Container>
    </Box>
  );
}

export default Register;