import React, { useState } from 'react';
import { TextField, Button, Typography, Link } from '@mui/material';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function ResetPassword() {
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const history = useHistory();

  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${apiUrl}/api/auth/reset-password`, { token, newPassword });
      alert('Password reset successful! Please login.');
      history.push('/');
    } catch (err) {
      alert(err.response?.data.msg || 'Reset failed');
    }
  };

  const goHome = () => history.push('/');

  return (
    <div>
      <div className="header">
        <h1 onClick={goHome}>ZvertexAI</h1>
        <div className="nav-links">
          <Link href="/">Login</Link>
        </div>
      </div>
      <div className="hero">
        <Typography variant="h2">Reset Password</Typography>
        <Typography variant="body1">Enter your new password</Typography>
      </div>
      <div className="card" style={{ maxWidth: '400px', margin: '40px auto' }}>
        <button className="back-button" onClick={() => history.goBack()}>
          Back
        </button>
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
          <Typography align="center" sx={{ mt: 2 }}>
            <Link href="/forgot-password">Forgot Password?</Link>
          </Typography>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;