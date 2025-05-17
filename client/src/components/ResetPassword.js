import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Box, Typography, TextField, Button, Container, CircularProgress } from '@mui/material';
import axios from 'axios';

function ResetPassword() {
  const { token } = useParams();
  const history = useHistory();
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL || 'https://zvertexai-orzv.onrender.com';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.password || !formData.confirmPassword) {
      setError('Both password fields are required');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post(`${apiUrl}/api/auth/reset-password/${token}`, { password: formData.password });
      setSuccess('Password reset successfully. Redirecting to login...');
      setTimeout(() => history.push('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', py: 4 }}>
      <Container maxWidth="sm">
        <Box sx={{ backgroundColor: 'rgba(255,255,255,0.1)', p: 4, borderRadius: '15px' }}>
          <Typography variant="h4" sx={{ color: 'white', mb: 3, textAlign: 'center' }}>
            Reset Password
          </Typography>
          {error && <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>{error}</Typography>}
          {success && <Typography color="success.main" sx={{ mb: 2, textAlign: 'center' }}>{success}</Typography>}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="New Password"
              type="password"
              fullWidth
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              sx={{ input: { color: 'white' }, label: { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } }, mb: 2 }}
            />
            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              sx={{ input: { color: 'white' }, label: { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } }, mb: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' } }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Reset Password'}
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default ResetPassword;