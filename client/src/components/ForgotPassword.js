import React, { useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const history = useHistory();

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

  const goHome = () => history.push('/');

  return (
    <div>
      <div className="header">
        <h1 onClick={goHome}>ZvertexAI</h1>
        <div className="nav-links">
          <a href="/">Login</a>
        </div>
      </div>
      <div className="hero">
        <Typography variant="h2">Forgot Password</Typography>
        <Typography variant="body1">Reset your password here</Typography>
      </div>
      <div className="card" style={{ maxWidth: '400px', margin: '40px auto' }}>
        <button className="back-button" onClick={() => history.goBack()}>
          Back
        </button>
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