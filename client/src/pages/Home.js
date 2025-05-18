import React from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Typography, Button, Container, Grid } from '@mui/material';

function Home() {
  const history = useHistory();
  const token = localStorage.getItem('token');

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h2" sx={{ color: 'white', mb: 2 }}>
            Welcome to ZvertexAI
          </Typography>
          <Typography variant="h5" sx={{ color: 'white', mb: 4 }}>
            Empowering careers with AI-driven job matching and automation.
          </Typography>
          {token ? (
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
                sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: '#ff6d00', color: '#ff6d00' } }}
                onClick={() => {
                  localStorage.removeItem('token');
                  history.push('/login');
                }}
              >
                Logout
              </Button>
            </Box>
          ) : (
            <Box>
              <Button
                variant="contained"
                sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' }, mr: 2 }}
                onClick={() => history.push('/signup')}
              >
                Get Started
              </Button>
              <Button
                variant="outlined"
                sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: '#ff6d00', color: '#ff6d00' } }}
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
              Find jobs tailored to your skills with our advanced AI algorithms.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
              Auto-Apply
            </Typography>
            <Typography variant="body2" sx={{ color: 'white' }}>
              Let ZvertexAI apply to jobs on your behalf throughout the day.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
              Subscription Plans
            </Typography>
            <Typography variant="body2" sx={{ color: 'white' }}>
              Choose from Student, Recruiter, or Business plans tailored to your needs.
            </Typography>
          </Grid>
        </Grid>
        <Box sx={{ py: 4, backgroundColor: '#1a2a44', color: 'white', mt: 6 }}>
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              <Grid item xs={12} sm={4}>
                <Typography variant="h6" sx={{ mb: 2 }}>ZvertexAI</Typography>
                <Typography variant="body2">
                  Empowering careers with AI-driven solutions.
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="h6" sx={{ mb: 2 }}>Quick Links</Typography>
                <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer' }} onClick={() => history.push('/dashboard')}>
                  Dashboard
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer' }} onClick={() => history.push('/subscription')}>
                  Subscription Plans
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
                  sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: '#ff6d00', color: '#ff6d00' } }}
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

export default Home;