import React, { useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function ResetPassword() {
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/auth/reset-password', { token, newPassword });
      alert('Password reset successful! Please login.');
      history.push('/');
    } catch (err) {
      alert(err.response?.data.msg || 'Reset failed');
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
        <Typography variant="h2">Reset Password</Typography>
        <Typography variant="body1">Enter your new password</Typography>
      </div>
      <div className="card" style={{ maxWidth: '400px', margin: '40px auto' }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Reset Token"
            fullWidth
            margin="normal"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <TextField
            label="New Password"
            type="password"
            fullWidth
            margin="normal"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Reset Password
          </Button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;