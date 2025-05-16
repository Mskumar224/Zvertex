import React from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Typography, Button, Container, Grid } from '@mui/material';

function Landing({ user, setUser }) {
  const history = useHistory();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    history.push('/');
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h2" sx={{ color: 'white', mb: 2 }}>
            Welcome to ZvertexAI
          </Typography>
          <Typography variant="h5" sx={{ color: 'white', mb: 4 }}>
            Powered by Zoho Prompt Engineering: AI-driven job matching and ZGPT in Telugu.
          </Typography>
          {user ? (
            <Box>
              <Button
                variant="contained"
                sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' }, mr: 2 }}
                onClick={() => history.push('/dashboard')}
              >
                Go to Dashboard
              </Button>
              <Button
                variant="outlined"
                sx={{ color: 'white', borderColor: 'white' }}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Box>
          ) : (
            <Box>
              <Button
                variant="contained"
                sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' }, mr: 2 }}
                onClick={() => history.push('/register')}
              >
                Get Started
              </Button>
              <Button
                variant="outlined"
                sx={{ color: 'white', borderColor: 'white' }}
                onClick={() => history.push('/login')}
              >
                Login
              </Button>
            </Box>
          )}
        </Box>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
              AI Job Matching
            </Typography>
            <Typography variant="body2" sx={{ color: 'white' }}>
              Auto-apply to real-time jobs with Indeed API integration.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
              ZGPT Copilot
            </Typography>
            <Typography variant="body2" sx={{ color: 'white' }}>
              Career advice in Telugu, powered by Llama 3.1.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
              Prompt Engineering
            </Typography>
            <Typography variant="body2" sx={{ color: 'white' }}>
              Zoho-driven prompts for precise AI responses.
            </Typography>
          </Grid>
        </Grid>
        <Box sx={{ py: 4, backgroundColor: '#1a2a44', color: 'white', mt: 6 }}>
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              <Grid item xs={12} sm={4}>
                <Typography variant="h6" sx={{ mb: 2 }}>ZvertexAI</Typography>
                <Typography variant="body2">
                  Powered by Zoho Prompt Engineering.
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="h6" sx={{ mb: 2 }}>Quick Links</Typography>
                <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer' }} onClick={() => history.push('/why-zvertexai')}>
                  Why ZvertexAI?
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer' }} onClick={() => history.push('/prompt-engineer')}>
                  Prompt Engineer
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer' }} onClick={() => history.push('/zgpt')}>
                  ZGPT Copilot
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="h6" sx={{ mb: 2 }}>Contact Us</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Address: 5900 BALCONES DR #16790 AUSTIN, TX 78731
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
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
            <Typography variant="body2" align="center" sx={{ mt: 4 }}>
              © 2025 ZvertexAI. All rights reserved.
            </Typography>
          </Container>
        </Box>
      </Container>
    </Box>
  );
}

export default Landing;