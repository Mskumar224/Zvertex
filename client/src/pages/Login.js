import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';
import { useHistory, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleLogin = async () => {
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, { email, password });
      localStorage.setItem('token', data.token);
      history.push('/student-dashboard');
    } catch (error) {
      alert('Login failed!');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 5 }} className="zgpt-container">
      <div className="card">
        <Typography variant="h4" gutterBottom align="center">
          Login to Your Account
        </Typography>
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
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogin}
            fullWidth
            className="back-button"
            sx={{ py: 1.5 }}
          >
            Login
          </Button>
        </Box>
        <Typography sx={{ mt: 2, textAlign: 'center' }}>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </Typography>
      </div>
    </Container>
  );
}

export default Login;