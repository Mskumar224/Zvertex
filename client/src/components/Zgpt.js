import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Paper,
  Container,
  Grid,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MenuIcon from '@mui/icons-material/Menu';
import axios from 'axios';

function Zgpt({ user, setSidebarOpen }) {
  const history = useHistory();
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const apiUrl = process.env.REACT_APP_API_URL || 'https://zvertexai-orzv.onrender.com';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('Please log in to use ZGPT.');
      return;
    }
    setLoading(true);
    setError('');
    setResponse('');
    try {
      const res = await axios.post(
        `${apiUrl}/api/zgpt`,
        { query },
        {
          headers: { 'x-auth-token': localStorage.getItem('token') },
        }
      );
      setResponse(res.data.response);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to get response.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#121212', color: 'white', py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, pl: 2 }}>
        <IconButton
          onClick={() => history.push(user ? '/dashboard' : '/')}
          sx={{ color: 'white', mr: 2 }}
        >
          <ArrowBackIcon />
        </IconButton>
        {user && (
          <IconButton
            onClick={() => setSidebarOpen(true)}
            sx={{ color: 'white' }}
          >
            <MenuIcon />
          </IconButton>
        )}
      </Box>
      <Container maxWidth="md">
        <Typography variant="h4" sx={{ mb: 4, textAlign: 'center', fontWeight: 'bold' }}>
          ZGPT - Your AI Career Copilot
        </Typography>
        <Paper
          sx={{
            p: 4,
            backgroundColor: '#1e1e1e',
            borderRadius: '15px',
            mb: 4,
          }}
        >
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Ask ZGPT anything about your career..."
              fullWidth
              multiline
              rows={3}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              sx={{ mb: 3, backgroundColor: '#263238', color: 'white' }}
              InputLabelProps={{ style: { color: '#b0bec5' } }}
              InputProps={{ style: { color: 'white' } }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                backgroundColor: '#ff6d00',
                '&:hover': { backgroundColor: '#e65100' },
                borderRadius: '10px',
                py: 1.5,
              }}
            >
              {loading ? 'Processing...' : 'Ask ZGPT'}
            </Button>
          </Box>
          {error && (
            <Typography sx={{ color: '#ff1744', mt: 2, textAlign: 'center' }}>
              {error}
            </Typography>
          )}
          {response && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                ZGPT Response:
              </Typography>
              <Typography sx={{ backgroundColor: '#263238', p: 2, borderRadius: '10px' }}>
                {response}
              </Typography>
            </Box>
          )}
        </Paper>
        <Typography variant="body1" sx={{ mb: 4, textAlign: 'center' }}>
          ZGPT helps with resume tips, interview prep, career advice, and more. Try asking: "How do I improve my resume?" or "What skills are in demand for DevOps?"
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Example Questions
            </Typography>
            <Typography sx={{ mb: 1 }}>- How can I prepare for a coding interview?</Typography>
            <Typography sx={{ mb: 1 }}>- What are the top skills for a data scientist?</Typography>
            <Typography sx={{ mb: 1 }}>- How do I negotiate a job offer?</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Features
            </Typography>
            <Typography sx={{ mb: 1 }}>- Personalized career advice</Typography>
            <Typography sx={{ mb: 1 }}>- Real-time responses</Typography>
            <Typography sx={{ mb: 1 }}>- Integration with your job search</Typography>
          </Grid>
        </Grid>
        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12} sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              onClick={() => history.push(user ? '/dashboard' : '/register')}
              sx={{
                backgroundColor: '#00e676',
                '&:hover': { backgroundColor: '#00c853' },
                borderRadius: '25px',
                px: 4,
                py: 1.5,
              }}
            >
              {user ? 'Back to Dashboard' : 'Join Now'}
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Zgpt;