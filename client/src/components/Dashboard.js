import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Typography, Button, Container, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function Dashboard({ user, setUser }) {
  const history = useHistory();

  useEffect(() => {
    if (user) {
      if (user.subscriptionType === 'Student') {
        history.push('/student-dashboard');
      } else if (user.subscriptionType === 'Recruiter') {
        history.push('/recruiter-dashboard');
      } else if (user.subscriptionType === 'Business') {
        history.push('/business-dashboard');
      }
    }
  }, [user, history]);

  if (!user) {
    history.push('/login');
    return null;
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#121212', color: 'white', py: 4 }}>
      <Container maxWidth="lg">
        <IconButton
          onClick={() => history.push('/')}
          sx={{ color: 'white', mb: 2 }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ mb: 4 }}>
            Welcome, {user.email}!
          </Typography>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Subscription: {user.subscriptionType} {user.trialActive ? '(Trial Active)' : ''}
          </Typography>
          <Button
            variant="contained"
            onClick={() =>
              history.push(
                user.subscriptionType === 'Student'
                  ? '/student-dashboard'
                  : user.subscriptionType === 'Recruiter'
                  ? '/recruiter-dashboard'
                  : '/business-dashboard'
              )
            }
            sx={{ mr: 2 }}
          >
            Go to Dashboard
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              localStorage.removeItem('token');
              setUser(null);
              history.push('/login');
            }}
          >
            Logout
          </Button>
        </Box>
      </Container>
      <Box sx={{ py: 4, backgroundColor: '#1a2a44', color: 'white', mt: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                About ZvertexAI
              </Typography>
              <Typography variant="body2">
                ZvertexAI empowers careers with AI-driven job matching, innovative projects, and ZGPT, your
                personal copilot. Join us to unlock your potential.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Quick Links
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer' }} onClick={() => history.push('/faq')}>
                Interview FAQs
              </Typography>
              <Typography
                variant="body2"
                sx={{ mb: 1, cursor: 'pointer' }}
                onClick={() => history.push('/why-us')}
              >
                Why ZvertexAI?
              </Typography>
              <Typography
                variant="body2"
                sx={{ mb: 1, cursor: 'pointer' }}
                onClick={() => history.push('/zgpt')}
              >
                ZGPT Copilot
              </Typography>
              <Typography
                variant="body2"
                sx={{ mb: 1, cursor: 'pointer' }}
                onClick={() => history.push('/contact')}
              >
                Contact Us
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Contact Info
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Address: 5900 Balcones Dr #16790, Austin, TX 78731
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Phone: (737) 239-0920
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Email: support@zvertexai.com
              </Typography>
            </Grid>
          </Grid>
          <Typography variant="body2" sx={{ mt: 4, textAlign: 'center' }}>
            © 2025 ZvertexAI. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default Dashboard;