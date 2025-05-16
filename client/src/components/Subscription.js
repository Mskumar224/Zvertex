import React from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Typography, Button, Container, Grid, Card, CardContent, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function Subscription({ user, setUser }) {
  const history = useHistory();

  const handleSubscribe = async (type) => {
    try {
      // Simulate subscription activation (payment gateway skipped)
      setUser({ ...user, subscriptionStatus: 'ACTIVE', subscriptionType: type });
      history.push('/dashboard');
    } catch (err) {
      console.error('Subscription error:', err.message);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={() => history.goBack()} sx={{ color: 'white' }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ color: 'white', flexGrow: 1, textAlign: 'center' }}>
            Subscription Plans
          </Typography>
        </Box>
        <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>
          Choose Your Plan
        </Typography>
        <Typography variant="body1" sx={{ color: 'white', mb: 4 }}>
          Powered by Zoho Prompt Engineering. Select a plan to unlock full features.
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '15px' }}>
              <CardContent>
                <Typography variant="h6">Student</Typography>
                <Typography variant="body2">4-day free trial</Typography>
                <Typography variant="body2">
                  Features: Job matching, ZGPT in Telugu, auto-apply
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2, backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' } }}
                  onClick={() => handleSubscribe('STUDENT')}
                >
                  Select
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '15px' }}>
              <CardContent>
                <Typography variant="h6">Recruiter</Typography>
                <Typography variant="body2">4-day free trial</Typography>
                <Typography variant="body2">
                  Features: Manage 5 profiles, analytics, auto-apply
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2, backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' } }}
                  onClick={() => handleSubscribe('RECRUITER')}
                >
                  Select
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '15px' }}>
              <CardContent>
                <Typography variant="h6">Business</Typography>
                <Typography variant="body2">4-day free trial</Typography>
                <Typography variant="body2">
                  Features: Manage 3 recruiters, enterprise analytics
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2, backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' } }}
                  onClick={() => handleSubscribe('BUSINESS')}
                >
                  Select
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Subscription;