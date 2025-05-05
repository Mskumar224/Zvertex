import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';
import { useHistory, Link } from 'react-router-dom';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleSignup = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/signup`, { email, password });
      alert('Signup successful! Please login to continue with ZvertexAI.');
      history.push('/login');
    } catch (error) {
      alert('Signup failed!');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 5 }} className="zgpt-container">
      <div className="card">
        <Typography variant="h4" gutterBottom align="center">
          Create Your Account
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
            onClick={handleSignup}
            fullWidth
            className="back-button"
            sx={{ py: 1.5 }}
          >
            Sign Up
          </Button>
        </Box>
        <Typography sx={{ mt: 2, textAlign: 'center' }}>
          Already have an account? <Link to="/login">Login</Link>
        </Typography>
      </div>
    </Container>
  );
}

export default Signup;