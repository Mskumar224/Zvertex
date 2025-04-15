import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  CircularProgress,
  Grid,
} from '@mui/material';
import axios from 'axios';

function ZGPT({ user }) {
  const history = useHistory();
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const apiUrl = process.env.REACT_APP_API_URL || 'https://zvertexai-orzv.onrender.com';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResponse('');
    try {
      const res = await axios.post(
        `${apiUrl}/api/zgpt`,
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
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', py: 8 }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h2" sx={{ color: 'white', mb: 2, fontWeight: 'bold' }}>
            ZGPT Copilot
          </Typography>
          <Typography variant="h5" sx={{ color: 'white', mb: 4 }}>
            Your AI-Powered Career Assistant
          </Typography>
        </Box>

        <Box sx={{ mb: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '15px', p: 4 }}>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Ask ZGPT anything..."
              fullWidth
              multiline
              rows={4}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              sx={{
                mb: 3,
                input: { color: 'white' },
                textarea: { color: 'white' },
                label: { color: 'white' },
                '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={loading || !query}
              sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' }, py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Send'}
            </Button>
          </form>

          {error && (
            <Typography sx={{ color: 'white', mt: 2, textAlign: 'center' }}>
              {error}
            </Typography>
          )}
          {response && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 'bold' }}>
                ZGPT Response
              </Typography>
              <Typography sx={{ color: 'white', backgroundColor: 'rgba(0,0,0,0.2)', p: 2, borderRadius: '10px' }}>
                {response}
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ py: 6, mt: 8, backgroundColor: '#1a2a44', borderRadius: '15px' }}>
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              <Grid item xs={12} sm={4}>
                <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                  ZvertexAI
                </Typography>
                <Typography variant="body2" sx={{ color: 'white' }}>
                  Empowering careers with AI-driven solutions.
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                  Quick Links
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'white', mb: 1, cursor: 'pointer' }}
                  onClick={() => history.push('/why-zvertexai')}
                >
                  Why ZvertexAI?
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'white', mb: 1, cursor: 'pointer' }}
                  onClick={() => history.push('/interview-faqs')}
                >
                  Interview FAQs
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'white', mb: 1, cursor: 'pointer' }}
                  onClick={() => history.push('/zgpt')}
                >
                  ZGPT Copilot
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                  Contact Us
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
                  Address: 5900 BALCONES DR #16790 AUSTIN, TX 78731
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
                  Phone: 737-239-0920
                </Typography>
                <Button
                  variant="outlined"
                  sx={{ color: 'white', borderColor: 'white' }}
                  onClick={() => history.push('/contact-us')}
                >
                  Reach Out
                </Button>
              </Grid>
            </Grid>
            <Typography variant="body2" align="center" sx={{ color: 'white', mt: 4 }}>
              © 2025 ZvertexAI. All rights reserved.
            </Typography>
          </Container>
        </Box>
      </Container>
    </Box>
  );
}

export default ZGPT;