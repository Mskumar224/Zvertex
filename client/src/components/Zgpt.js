import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Typography, TextField, Button, Container, CircularProgress, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';

function ZGPT({ user }) {
  const history = useHistory();
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
        `${apiUrl}/api/zgpt/chat`,
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
          <IconButton onClick={() => history.goBack()} sx={{ color: 'white' }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ color: 'white', flexGrow: 1, textAlign: 'center' }}>
            ZGPT Copilot
          </Typography>
        </Box>
        <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>
          Your AI Career Assistant
        </Typography>
        <Typography variant="body1" sx={{ color: 'white', mb: 4 }}>
          Ask ZGPT for career advice, resume tips, or job search strategies.
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Ask ZGPT..."
            fullWidth
            multiline
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            sx={{ mb: 2, input: { color: 'white' }, label: { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } } }}
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
        {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
        {response && (
          <Box sx={{ mt: 4, p: 2, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '10px' }}>
            <Typography variant="h6" sx={{ color: 'white' }}>ZGPT Response</Typography>
            <Typography variant="body1" sx={{ color: 'white' }}>{response}</Typography>
          </Box>
        )}
        <Box sx={{ py: 4, backgroundColor: '#1a2a44', color: 'white', mt: 4 }}>
          <Container maxWidth="lg">
            <Typography variant="body2" align="center">
              © 2025 ZvertexAI. All rights reserved.
            </Typography>
          </Container>
        </Box>
      </Container>
    </Box>
  );
}

export default ZGPT;