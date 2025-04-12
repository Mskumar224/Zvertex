import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Typography, TextField, Button, Container, Grid } from '@mui/material';
import axios from 'axios';

class ErrorBoundary extends React.Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return <Typography color="error">Something went wrong: {this.state.error.message}</Typography>;
    }
    return this.props.children;
  }
}

function ZGPT({ user }) {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const history = useHistory();
  const apiUrl = process.env.REACT_APP_API_URL || 'https://zvertexai-orzv.onrender.com';

  const handleQuery = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${apiUrl}/api/zgpt`,
        { query },
        { headers: { 'x-auth-token': token } }
      );
      setResponse(res.data.response);
    } catch (err) {
      setResponse(err.response?.data?.msg || 'Failed to get response');
    }
  };

  return (
    <ErrorBoundary>
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', color: 'white' }}>
        <Container maxWidth="lg">
          <Box sx={{ mt: 4, mb: 8 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
              ZGPT Copilot
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
              Ask ZGPT anything to get personalized career advice and insights.
            </Typography>
            <Box sx={{ mb: 4 }}>
              <TextField
                label="Your Question"
                fullWidth
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                sx={{
                  mb: 2,
                  input: { color: 'white' },
                  label: { color: 'white' },
                  '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } },
                }}
              />
              <Button
                variant="contained"
                onClick={handleQuery}
                sx={{
                  backgroundColor: '#ff6d00',
                  '&:hover': { backgroundColor: '#e65100' },
                  color: 'white',
                  borderRadius: '25px',
                  px: 4,
                  py: 1.5,
                }}
              >
                Ask ZGPT
              </Button>
            </Box>
            {response && (
              <Box sx={{ backgroundColor: 'rgba(255,255,255,0.1)', p: 3, borderRadius: '15px' }}>
                <Typography variant="body1">{response}</Typography>
              </Box>
            )}
          </Box>
        </Container>
        <Box sx={{ py: 4, backgroundColor: '#1a2a44', color: 'white' }}>
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              <Grid item xs={12} sm={4}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>About ZvertexAI</Typography>
                <Typography variant="body2">
                  ZvertexAI empowers your career with AI-driven job matching, innovative projects, and ZGPT, your personal copilot.
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Quick Links</Typography>
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer' }} onClick={() => history.push('/faq')}>
                    Interview FAQs
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer' }} onClick={() => history.push('/why-us')}>
                    Why ZvertexAI?
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer' }} onClick={() => history.push('/zgpt')}>
                    ZGPT Copilot
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer' }} onClick={() => history.push('/contact')}>
                    Contact Us
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Contact Us</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Address: 5900 Balcones Dr #16790, Austin, TX 78731
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Phone: (737) 239-0920
                </Typography>
                <Typography variant="body2">
                  Email: support@zvertexai.com
                </Typography>
              </Grid>
            </Grid>
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography variant="body2">
                © 2025 ZvertexAI. All rights reserved.
              </Typography>
            </Box>
          </Container>
        </Box>
      </Box>
    </ErrorBoundary>
  );
}

export default ZGPT;