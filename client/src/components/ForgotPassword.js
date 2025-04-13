import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Typography, TextField, Button, Container, Grid, CircularProgress } from '@mui/material';
import axios from 'axios';

function ForgotPassword() {
  const history = useHistory();
  const [formData, setFormData] = useState({ email: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL || 'https://zvertexai-orzv.onrender.com';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post(`${apiUrl}/api/auth/forgot-password`, { email: formData.email });
      setSuccess('Password reset email sent');
      setTimeout(() => history.push('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', py: 4 }}>
      <Container maxWidth="sm">
        <Box sx={{ backgroundColor: 'rgba(255,255,255,0.1)', p: 4, borderRadius: '15px' }}>
          <Typography variant="h4" sx={{ color: 'white', mb: 3, textAlign: 'center' }}>
            Forgot Password
          </Typography>
          {error && <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>{error}</Typography>}
          {success && <Typography sx={{ color: 'white', mb: 2, textAlign: 'center' }}>{success}</Typography>}
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  sx={{ input: { color: 'white' }, label: { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } } }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' } }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Send Reset Email'}
                </Button>
              </Grid>
            </Grid>
          </Box>
          <Typography sx={{ color: 'white', mt: 2, textAlign: 'center' }}>
            Back to{' '}
            <Button sx={{ color: '#ff6d00' }} onClick={() => history.push('/login')}>
              Login
            </Button>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default ForgotPassword;