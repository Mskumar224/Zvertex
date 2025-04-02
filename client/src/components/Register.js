import React, { useState } from 'react';
import { TextField, Button, Typography, MenuItem } from '@mui/material';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [subscriptionType, setSubscriptionType] = useState('STUDENT');
  const history = useHistory();

  const apiUrl = process.env.REACT_APP_API_URL || 'https://zvertexai-orzv.onrender.com';
  console.log('API URL being used:', apiUrl);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${apiUrl}/api/auth/register`, { email, password, subscriptionType });
      alert('Registration successful! Please login.');
      history.push('/');
    } catch (err) {
      console.error('Register Error:', err.response ? err.response.data : err.message);
      alert(err.response?.data.msg || 'Registration failed. Check console for details.');
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
        <Typography variant="h2">Join Us</Typography>
        <Typography variant="body1">Create an account to get started</Typography>
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
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            select
            label="Subscription Type"
            fullWidth
            margin="normal"
            value={subscriptionType}
            onChange={(e) => setSubscriptionType(e.target.value)}
          >
            <MenuItem value="STUDENT">Student (Free)</MenuItem>
            <MenuItem value="RECRUITER">Recruiter (Free)</MenuItem>
            <MenuItem value="BUSINESS">Business (Free)</MenuItem>
          </TextField>
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Register
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Register;