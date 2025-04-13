import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  List,
  ListItem,
  ListItemText,
  AppBar,
  Toolbar,
} from '@mui/material';
import axios from 'axios';

function Zgpt() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get(`${process.env.REACT_APP_API_URL || 'http://localhost:5002'}/api/auth/user`, {
          headers: { 'x-auth-token': token },
        })
        .then((res) => setUser(res.data))
        .catch(() => localStorage.removeItem('token'));
    }
  }, []);

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5002'}/api/zgpt/query`,
        { prompt },
        { headers: { 'x-auth-token': token } }
      );
      setMessages([...messages, { user: prompt, zgpt: res.data.response }]);
      setPrompt('');
    } catch (err) {
      alert('Error: ' + (err.response?.data?.msg || 'Failed to get response'));
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#1a2a44', color: 'white' }}>
      <AppBar
        position="static"
        sx={{ backgroundColor: 'rgba(26, 42, 68, 0.9)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
      >
        <Toolbar>
          <Typography
            variant="h5"
            sx={{ flexGrow: 1, fontWeight: 'bold', cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            ZvertexAI
          </Typography>
          {user && (
            <Button
              color="inherit"
              onClick={() => {
                localStorage.removeItem('token');
                setUser(null);
                navigate('/');
              }}
            >
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ pt: 4 }}>
        <Typography variant="h4" sx={{ mb: 4 }}>
          ZGPT - Your AI Copilot
        </Typography>
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask ZGPT anything..."
            sx={{
              input: { color: 'white' },
              '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } },
            }}
          />
          <Button
            variant="contained"
            sx={{ mt: 2, backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' } }}
            onClick={handleSubmit}
          >
            Send
          </Button>
        </Box>
        <List>
          {messages.map((msg, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={`You: ${msg.user}`}
                secondary={`ZGPT: ${msg.zgpt}`}
                secondaryTypographyProps={{ color: '#00e676' }}
              />
            </ListItem>
          ))}
        </List>
      </Container>
    </Box>
  );
}

export default Zgpt;