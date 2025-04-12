import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  Button,
  Container,
  TextField,
  Paper,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';

function ZGPT() {
  const history = useHistory();
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Add user message
    const userMessage = { role: 'user', content: query };
    setMessages((prev) => [...prev, userMessage]);
    setQuery('');
    setLoading(true);

    try {
      // Call ZGPT API (placeholder)
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/zgpt`,
        { query },
        { headers: { 'x-auth-token': localStorage.getItem('token') } }
      );
      const aiMessage = { role: 'assistant', content: res.data.response };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      const errorMessage = { role: 'assistant', content: 'Sorry, I couldn’t process your request. Try again later.' };
      setMessages((prev) => [...prev, errorMessage]);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    history.push('/');
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', color: 'white' }}>
      <AppBar position="static" sx={{ backgroundColor: 'rgba(26, 42, 68, 0.9)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
        <Toolbar>
          <Typography
            variant="h5"
            sx={{ flexGrow: 1, fontWeight: 'bold', cursor: 'pointer', color: '#ffffff' }}
            onClick={() => history.push('/')}
          >
            ZvertexAI
          </Typography>
          <Button sx={{ color: '#ffffff' }} onClick={() => history.push('/')}>
            Home
          </Button>
          <Button sx={{ color: '#ffffff' }} onClick={() => history.push('/login')}>
            Login
          </Button>
          <Button sx={{ color: '#ffffff' }} onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ pt: 8, pb: 6 }}>
        <Typography
          variant="h4"
          sx={{
            mb: 4,
            textAlign: 'center',
            textShadow: '0 0 10px rgba(255,109,0,0.5)',
          }}
        >
          ZGPT Copilot
        </Typography>
        <Typography variant="h6" sx={{ mb: 4, textAlign: 'center', color: '#d0d0d0' }}>
          Your AI-powered career advisor. Ask about jobs, resumes, or career paths!
        </Typography>

        <Paper
          sx={{
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderRadius: '15px',
            p: 3,
            minHeight: '400px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          }}
        >
          <List sx={{ flexGrow: 1, overflowY: 'auto' }}>
            {messages.map((msg, index) => (
              <ListItem
                key={index}
                sx={{
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <Paper
                  sx={{
                    maxWidth: '70%',
                    p: 2,
                    backgroundColor: msg.role === 'user' ? '#ff6d00' : 'rgba(255,255,255,0.1)',
                    color: msg.role === 'user' ? 'white' : '#d0d0d0',
                    borderRadius: msg.role === 'user' ? '20px 20px 0 20px' : '20px 20px 20px 0',
                  }}
                >
                  <ListItemText primary={msg.content} />
                </Paper>
              </ListItem>
            ))}
            {loading && (
              <ListItem>
                <Typography sx={{ color: '#d0d0d0' }}>ZGPT is thinking...</Typography>
              </ListItem>
            )}
          </List>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: 'flex',
              alignItems: 'center',
              mt: 2,
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderRadius: '30px',
              p: 1,
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            }}
          >
            <TextField
              placeholder="Ask ZGPT about your career..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              fullWidth
              sx={{
                '& .MuiInputBase-root': { color: '#d0d0d0' },
                '& fieldset': { border: 'none' },
              }}
            />
            <Button
              type="submit"
              disabled={loading || !query.trim()}
              sx={{
                backgroundColor: '#ff6d00',
                borderRadius: '25px',
                p: 1,
                minWidth: '40px',
                '&:hover': { backgroundColor: '#e65100' },
                '&:disabled': { backgroundColor: '#b0b0b0' },
              }}
            >
              <SendIcon sx={{ color: 'white' }} />
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default ZGPT;