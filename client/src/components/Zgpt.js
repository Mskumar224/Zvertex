import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Typography, TextField, Button, Container, Grid, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';

function ZGPT({ user }) {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const messagesEndRef = useRef(null);
  const apiUrl = process.env.REACT_APP_API_URL || 'https://zvertexai-orzv.onrender.com';

  useEffect(() => {
    if (!user) {
      history.push('/login');
      return;
    }
  }, [user, history]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMessage = { sender: 'user', text: query };
    setMessages([...messages, userMessage]);
    setQuery('');
    setLoading(true);

    try {
      const res = await axios.post(`${apiUrl}/api/zgpt/query`, { query }, {
        headers: { 'x-auth-token': localStorage.getItem('token') },
      });
      setMessages((prev) => [...prev, { sender: 'zgpt', text: res.data.text || 'No response' }]);
      setError('');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to get response');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)',
      color: 'white',
      py: 8,
    }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ff6d00' }}>
              ZGPT Copilot
            </Typography>
            <Button
              variant="text"
              sx={{ color: '#00e676', textTransform: 'none' }}
              onClick={() => history.push('/dashboard')}
            >
              Back to Dashboard
            </Button>
          </Box>
          <Box sx={{
            width: '100%',
            maxWidth: '800px',
            height: '400px',
            overflowY: 'auto',
            backgroundColor: 'rgba(255,255,255,0.1)',
            p: 3,
            borderRadius: '15px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}>
            {messages.length === 0 && !loading && (
              <Typography sx={{ color: 'white', textAlign: 'center', py: 4 }}>
                Start by asking ZGPT a question!
              </Typography>
            )}
            {messages.map((msg, index) => (
              <Box
                key={index}
                sx={{
                  p: 2,
                  borderRadius: '10px',
                  backgroundColor: msg.sender === 'user' ? '#ff6d00' : '#00e676',
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '70%',
                  color: 'white',
                }}
              >
                <Typography variant="body2">{msg.text}</Typography>
              </Box>
            ))}
            {loading && (
              <Box sx={{ alignSelf: 'center', py: 2 }}>
                <CircularProgress size={24} color="inherit" />
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>
          {error && <Alert severity="error" sx={{ borderRadius: '10px', width: '100%', maxWidth: '800px' }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit} sx={{
            width: '100%',
            maxWidth: '800px',
            display: 'flex',
            gap: 2,
            flexWrap: 'wrap',
          }}>
            <TextField
              placeholder="Ask ZGPT anything..."
              fullWidth
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={loading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#ff6d00' },
                  '&:hover fieldset': { borderColor: '#e65100' },
                  '&.Mui-focused fieldset': { borderColor: '#00e676' },
                },
                '& .MuiInputBase-input': { color: 'white' },
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
                px: 4,
                fontWeight: 'bold',
              }}
            >
              Send
            </Button>
          </Box>
        </Box>
      </Container>
      <Box sx={{
        py: 4,
        mt: 8,
        backgroundColor: '#1a2a44',
        color: 'white',
        textAlign: 'center',
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#ff6d00' }}>
                About ZvertexAI
              </Typography>
              <Typography variant="body2" sx={{ color: 'white' }}>
                Empowering careers with AI-driven job matching and ZGPT copilot.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#ff6d00' }}>
                Quick Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button sx={{ color: '#00e676' }} onClick={() => history.push('/faq')}>Interview FAQs</Button>
                <Button sx={{ color: '#00e676' }} onClick={() => history.push('/why-us')}>Why ZvertexAI?</Button>
                <Button sx={{ color: '#00e676' }} onClick={() => history.push('/projects')}>Our Projects</Button>
                <Button sx={{ color: '#00e676' }} onClick={() => history.push('/contact-us')}>Contact Us</Button>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#ff6d00' }}>
                Contact Info
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, color: 'white' }}>
                Address: 5900 Balcones Dr #16790, Austin, TX 78731
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, color: 'white' }}>
                Phone: (737) 239-0920
              </Typography>
              <Typography variant="body2" sx={{ color: 'white' }}>
                Email: support@zvertexai.com
              </Typography>
            </Grid>
          </Grid>
          <Typography variant="body2" sx={{ mt: 4, color: 'white' }}>
            © 2025 ZvertexAI. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default ZGPT;