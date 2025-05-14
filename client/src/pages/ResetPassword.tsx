import React, { useState } from 'react';
import { Container, TextField, Button, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setMessage('Invalid or missing reset token.');
      return;
    }
    try {
      const res = await axios.post('https://zvertexai-orzv.onrender.com/api/reset-password', { token, password });
      setMessage(res.data.message);
      setTimeout(() => navigate('/login'), 2000);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Server error';
      if (error.response?.status === 404) {
        setMessage('Reset password endpoint not found. Please check the server.');
      } else if (error.response?.status === 400) {
        setMessage(`Reset failed: ${errorMessage}`);
      } else {
        setMessage(`Reset failed: ${errorMessage}`);
      }
    }
  };

  return (
    <Container className="glass-card" sx={{ mt: 5, py: 5 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 500 }}>Reset Password</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="New Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" sx={{ mt: 2, mr: 2, px: 4, py: 1.5 }}>Reset Password</Button>
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

export default ResetPassword;