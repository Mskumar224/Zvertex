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
      localStorage.setItem('token', res.data.token);
      setMessage('Login successful! Redirecting to dashboard...');
      setTimeout(() => navigate('/dashboard'), 1000); // Redirect to dashboard after 1 second
    } catch (error: any) {
      setMessage('Login failed: ' + (error.response?.data?.message || error.message));
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
          sx={{ mt: 2, px: 4, py: 1.5, borderColor: '#003087', color: '#003087' }}
        >
          Back
        </Button>
      </form>
      <Link href="/forgot-password" sx={{ mt: 2, display: 'block', color: '#003087' }}>
        Forgot Password?
      </Link>
      {message && (
        <Typography sx={{ mt: 2, color: message.includes('failed') ? '#dc3545' : '#28a745' }}>
          {message}
        </Typography>
      )}
    </Container>
  );
};

export default Login;