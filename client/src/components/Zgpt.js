import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Container, CircularProgress, Alert } from '@mui/material';
import BackButton from './BackButton';
import axios from 'axios';

function ZGPT({ user }) {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const apiUrl = process.env.REACT_APP_API_URL || 'https://zvertexai-orzv.onrender.com';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(
        `${apiUrl}/api/zgpt`,
        { prompt },
        { headers: { 'x-auth-token': localStorage.getItem('token') } }
      );
      setResponse(res.data.response);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to get response');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <BackButton />
          <Typography variant="h4" sx={{ color: 'white', flexGrow: 1, textAlign: 'center' }}>
            ZGPT
          </Typography>
        </Box>
        <Box sx={{ backgroundColor: 'rgba(255,255,255,0.1)', p: 4, borderRadius: '15px' }}>
          <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>
            Ask ZGPT
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Enter your prompt"
              fullWidth
              multiline
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              sx={{ input: { color: 'white' }, label: { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } }, mb: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' } }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
            </Button>
          </Box>
          {response && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ color: 'white' }}>
                Response
              </Typography>
              <Typography sx={{ color: 'white' }}>{response}</Typography>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}

export default ZGPT;