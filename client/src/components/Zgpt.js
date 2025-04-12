import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Container, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function ZGPT({ user, apiUrl }) {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const history = useHistory();

  useEffect(() => {
    if (!user) {
      history.push('/login');
    }
  }, [user, history]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setResponse('');

    try {
      const res = await axios.post(
        `${apiUrl}/api/zgpt/query`,
        { query },
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
    <Box sx={{
      minHeight: 'calc(100vh - 64px)',
      color: 'white',
    }}>
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ffffff' }}>
            ZGPT Copilot
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              background: 'rgba(255, 255, 255, 0.1)',
              p: 4,
              borderRadius: '15px',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              transition: 'all 0.3s ease',
            }}
          >
            <TextField
              label="Ask ZGPT anything..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              fullWidth
              multiline
              rows={3}
              sx={{
                '& .MuiInputBase-input': { color: 'white' },
                '& .MuiInputLabel-root': { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                  '&:hover fieldset': { borderColor: '#00e676' },
                  '&.Mui-focused fieldset': { borderColor: '#00e676' },
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={loading || !query.trim()}
              sx={{
                backgroundColor: '#ff6d00',
                '&:hover': { backgroundColor: '#e65100' },
                borderRadius: '25px',
                py: 1.5,
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
            </Button>
          </Box>
          {error && (
            <Typography color="error" sx={{ textAlign: 'center' }}>
              {error}
            </Typography>
          )}
          {response && (
            <Box sx={{
              background: 'rgba(255, 255, 255, 0.1)',
              p: 3,
              borderRadius: '10px',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
              transition: 'all 0.3s ease',
            }}>
              <Typography variant="body1" sx={{ color: 'white' }}>
                {response}
              </Typography>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}

export default ZGPT;