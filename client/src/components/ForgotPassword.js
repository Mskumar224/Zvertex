import React, { useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import axios from 'axios';

function ForgotPassword() {
  const [email, setEmail] = useState('');

  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${apiUrl}/api/auth/forgot-password`, { email });
      alert(`Reset token: ${res.data.resetToken} (In real app, check email)`);
    } catch (err) {
      alert(err.response?.data.msg || 'Error sending reset link');
    }
  };

  return (
    <div>
      <div className="header">
        <h1>ZvertexAGI</h1>
        <div className="nav-links">
          <a href="/">Login</a>
        </div>
      </div>
      <div className="hero">
        <Typography variant="h2">Forgot Password</Typography>
        <Typography variant="body1">Reset your password here</Typography>
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
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Send Reset Link
          </Button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;