import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Typography, TextField, Button, CircularProgress, Paper, Avatar, Container, Grid, Divider } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';

function ZGPT() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const history = useHistory();
  const apiUrl = process.env.REACT_APP_API_URL || 'https://zvertexai-orzv.onrender.com';

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMessage = { sender: 'user', text: query, timestamp: new Date().toLocaleTimeString() };
    setMessages((prev) => [...prev, userMessage]);
    setQuery('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${apiUrl}/api/zgpt/query`,
        { query },
        { headers: { 'x-auth-token': token || '' } }
      );
      const botMessage = { sender: 'zgpt', text: res.data.text, timestamp: new Date().toLocaleTimeString() };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('ZGPT Error:', err);
      let errorMessage;
      if (err.response?.status === 401) {
        errorMessage = { 
          sender: 'zgpt', 
          text: 'Please log in or register to use ZGPT! Click "Subscribe" below.', 
          timestamp: new Date().toLocaleTimeString() 
        };
      } else if (err.response?.status === 502) {
        errorMessage = { 
          sender: 'zgpt', 
          text: 'Server is having a hiccup. Try again soon!', 
          timestamp: new Date().toLocaleTimeString() 
        };
      } else {
        errorMessage = { 
          sender: 'zgpt', 
          text: 'Oops, something went wrong. Retry?', 
          timestamp: new Date().toLocaleTimeString() 
        };
      }
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#121212', padding: '20px', color: 'white' }}>
      <Container maxWidth="lg">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => history.goBack()}
          sx={{ mb: 2, color: '#ff6d00' }}
        >
          Back
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#00e676', mb: 3, textAlign: 'center' }}>
          ZGPT - Your Free Copilot Agent
        </Typography>
        <Paper elevation={3} sx={{ 
          maxWidth: '800px', 
          margin: '0 auto', 
          backgroundColor: '#1e1e1e', 
          borderRadius: '15px', 
          padding: '20px', 
          height: '70vh', 
          display: 'flex', 
          flexDirection: 'column' 
        }}>
          <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2 }}>
            {messages.length === 0 ? (
              <Typography sx={{ color: '#b0b0b0', textAlign: 'center', mt: 5 }}>
                Start chatting with ZGPT! Ask anything—like "What’s the best tech job in 2025?"
              </Typography>
            ) : (
              messages.map((msg, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    mb: 2,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {msg.sender === 'zgpt' && (
                      <Avatar sx={{ bgcolor: '#00e676', mr: 1 }}>Z</Avatar>
                    )}
                    <Box
                      sx={{
                        backgroundColor: msg.sender === 'user' ? '#ff6d00' : '#424242',
                        color: 'white',
                        borderRadius: '15px',
                        p: 2,
                        maxWidth: '70%',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
                      }}
                    >
                      <Typography variant="body1">{msg.text}</Typography>
                      <Typography variant="caption" sx={{ color: '#b0b0b0', mt: 1 }}>
                        {msg.timestamp}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))
            )}
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                <Box sx={{ backgroundColor: '#424242', borderRadius: '15px', p: 2 }}>
                  <Typography variant="body1" sx={{ color: '#00e676' }}>Typing...</Typography>
                </Box>
              </Box>
            )}
            <div ref={chatEndRef} />
          </Box>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              placeholder="Ask ZGPT anything..."
              fullWidth
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              variant="outlined"
              sx={{
                backgroundColor: '#303030',
                borderRadius: '20px',
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { border: 'none' },
                  '&:hover fieldset': { border: 'none' },
                  '&.Mui-focused fieldset': { border: 'none' },
                },
                input: { color: 'white' },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              sx={{
                ml: 2,
                backgroundColor: '#00e676',
                '&:hover': { backgroundColor: '#00c853' },
                borderRadius: '20px',
                p: '10px',
              }}
              disabled={loading}
            >
              <SendIcon />
            </Button>
          </Box>
        </Paper>
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button 
            variant="outlined" 
            sx={{ color: '#00e676', borderColor: '#00e676' }} 
            onClick={() => history.push('/register')}
          >
            Subscribe for More Features!
          </Button>
        </Box>
      </Container>

      <Box sx={{ py: 4, backgroundColor: '#1a2a44', textAlign: 'center', mt: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>ZvertexAI</Typography>
              <Typography variant="body2">
                Empowering careers and businesses with AI-driven solutions.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Quick Links</Typography>
              <Typography variant="body2" sx={{ cursor: 'pointer' }} onClick={() => history.push('/contact')}>
                Contact Us
              </Typography>
              <Typography variant="body2" sx={{ cursor: 'pointer' }} onClick={() => history.push('/faq')}>
                Interview FAQs
              </Typography>
              <Typography variant="body2" sx={{ cursor: 'pointer' }} onClick={() => history.push('/why-us')}>
                Why ZvertexAI?
              </Typography>
              <Typography variant="body2" sx={{ cursor: 'pointer' }} onClick={() => history.push('/zgpt')}>
                ZGPT Copilot
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Contact</Typography>
              <Typography variant="body2">5900 Balcones Dr #16790, Austin, TX 78731</Typography>
              <Typography variant="body2">Phone: 737-239-0920 (151)</Typography>
              <Typography variant="body2">Email: support@zvertexai.com</Typography>
            </Grid>
          </Grid>
          <Divider sx={{ my: 2, backgroundColor: '#fff' }} />
          <Typography variant="body2">
            © 2025 ZvertexAI. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default ZGPT;