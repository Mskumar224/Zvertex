import React, { useState } from 'react';
import { TextField, Button, Typography, Link } from '@mui/material';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setUser({ subscriptionType: res.data.subscriptionType });
      history.push('/dashboard');
    } catch (err) {
      alert(err.response?.data.msg || 'Login failed');
    }
  };

  return (
    <div>
      <div className="header">
        <h1>ZvertexAGI</h1>
        <div className="nav-links">
          <Link href="/register">Register</Link>
        </div>
      </div>
      <div className="hero">
        <Typography variant="h2">Welcome Back</Typography>
        <Typography variant="body1">Log in to manage your job applications</Typography>
      </div>
      <div className="card" style={{ maxWidth: '400px', margin: '40px auto' }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Login
          </Button>
          <Typography align="center" sx={{ mt: 2 }}>
            <Link href="/forgot-password">Forgot Password?</Link>
          </Typography>
        </form>
      </div>
    </div>
  );
}

export default Login;