import React, { useState } from 'react';
import { Container, TextField, Button, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://zvertexai-orzv.onrender.com/api/forgot-password', { email });
      setMessage(res.data.message);
      setTimeout(() => navigate('/login'), 2000);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Server error';
      if (error.response?.status === 404) {
        setMessage('Forgot password endpoint not found. Please check the server.');
      } else if (error.response?.status === 400) {
        setMessage(`Request failed: ${errorMessage}`);
      } else {
        setMessage(`Request failed: ${errorMessage}`);
      }
    }
  };

  return (
    <Container className="glass-card" sx={{ mt: 5, py: 5 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 500 }}>Forgot Password</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" sx={{ mt: 2, mr: 2, px: 4, py: 1.5 }}>Submit</Button>
        <Button
          variant="outlined"
          onClick={() => navigate('/login')}
          sx={{ mt: 2, px: 4, py: 1.5 }}
        >
          Back
        </Button>
      </form>
      {message && (
        <Typography sx={{ mt: 2, color: message.includes('failed') ? '#dc3545' : '#28a745' }}>
          {message}
        </Typography>
      )}
    </Container>
  );
};

export default ForgotPassword;