import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import BackButton from '../components/BackButton';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleLogin = async () => {
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, { email, password });
      localStorage.setItem('token', data.token);
      history.push('/subscription');
      alert(data.message);
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed!');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 5, background: '#fff', borderRadius: 2, boxShadow: 3 }}>
      <BackButton />
      <Typography variant="h4" gutterBottom align="center" sx={{ color: '#1976d2' }}>Login to ZvertexAI</Typography>
      <Box component="form" sx={{ mt: 3 }}>
        <TextField
          label="Email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 3 }}
          variant="outlined"
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 3 }}
          variant="outlined"
        />
        <Button variant="contained" color="primary" onClick={handleLogin} fullWidth sx={{ py: 1.5 }}>
          Login
        </Button>
      </Box>
      <Typography sx={{ mt: 2, textAlign: 'center' }}>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </Typography>
      <Typography sx={{ mt: 1, textAlign: 'center' }}>
        Forgot password? <Link to="/forgot-password">Reset Password</Link>
      </Typography>
    </Container>
  );
}

export default Login;