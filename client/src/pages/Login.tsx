import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Link } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://zvertexai-orzv.onrender.com/api/login', { email, password });
      localStorage.setItem('token', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);
      setMessage('Login successful! Redirecting to dashboard...');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Server not found. Please try again later.';
      if (error.response?.status === 401) {
        setMessage('Unauthorized: Invalid credentials.');
      } else if (error.response?.status === 404) {
        setMessage('Login endpoint not found. Please check the server.');
      } else if (error.response?.status === 400) {
        setMessage(`Login failed: ${errorMessage}`);
      } else {
        setMessage(`Login failed: ${errorMessage}`);
      }
    }
  };

  return (
    <Container className="glass-card" sx={{ mt: 5, py: 5 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 500 }}>Login</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" sx={{ mt: 2, mr: 2, px: 4, py: 1.5 }}>Login</Button>
        <Button
          variant="outlined"
          onClick={() => navigate('/')}
          sx={{ mt: 2, px: 4, py: 1.5 }}
        >
          Back
        </Button>
      </form>
      <Link href="/forgot-password" sx={{ mt: 2, display: 'block', color: '#003087' }}>
        Forgot Password?
      </Link>
      {message && (
        <Typography sx={{ mt: 2, color: message.includes('failed') || message.includes('Unauthorized') ? '#dc3545' : '#28a745' }}>
          {message}
        </Typography>
      )}
    </Container>
  );
};

export default Login;