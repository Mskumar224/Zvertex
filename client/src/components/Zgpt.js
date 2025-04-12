import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  TextField,
  Button,
  AppBar,
  Toolbar,
} from '@mui/material';

function ZGPT() {
  const history = useHistory();
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (query.toLowerCase().includes('future of ai')) {
      setResponse('AI will revolutionize jobs—subscribe to see how!');
    } else {
      setResponse('Ask me about the future of AI or other topics!');
    }
    setQuery('');
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', color: 'white' }}>
      <AppBar position="static" sx={{ backgroundColor: 'rgba(26, 42, 68, 0.9)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 'bold', cursor: 'pointer' }} onClick={() => history.push('/')}>
            ZvertexAI
          </Typography>
          <Button color="inherit" onClick={() => history.push('/dashboard')}>
            Dashboard
          </Button>
          <Button
            color="inherit"
            onClick={() => {
              localStorage.removeItem('token');
              history.push('/');
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ pt: 8 }}>
        <Typography variant="h4" sx={{ mb: 4 }}>ZGPT - Your AI Copilot</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
          <TextField
            fullWidth
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask ZGPT about AI..."
            autoFocus
            sx={{
              input: { color: 'white' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'white' },
                '&:hover fieldset': { borderColor: '#ff6d00' },
                '&.Mui-focused fieldset': { borderColor: '#ff6d00' },
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 2, backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' } }}
          >
            Ask ZGPT
          </Button>
        </Box>
        {response && (
          <Box sx={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '10px', p: 2 }}>
            <Typography variant="body1">{response}</Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default ZGPT;