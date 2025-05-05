import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
} from '@mui/material';

function Home() {
  const history = useHistory();

  const handleSubscriptionClick = (plan) => {
    history.push(`/subscription-form?plan=${plan}`);
  };

  return (
    <Box
      className="zgpt-container"
      sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', color: 'white' }}
    >
      <Container maxWidth="lg" sx={{ pt: 8, pb: 6 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
            Welcome to ZvertexAI
          </Typography>
          <Typography variant="h5" sx={{ opacity: 0.9 }}>
            Empowering careers with AI-driven job matching and ZOHA copilot.
          </Typography>
        </Box>

        <Grid container spacing={4} sx={{ mb: 8 }}>
          <Grid item xs={12} sm={6}>
            <Card
              className="card"
              sx={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                color: 'white',
                borderRadius: '15px',
                height: '100%',
                transition: 'transform 0.3s',
                '&:hover': { transform: 'scale(1.05)' },
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  AI Job Matching
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Find jobs tailored to your skills with our advanced AI algorithms.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card
              className="card"
              sx={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                color: 'white',
                borderRadius: '15px',
                height: '100%',
                transition: 'transform 0.3s',
                '&:hover': { transform: 'scale(1.05)' },
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  ZOHA Copilot
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Get real-time career advice and interview tips from our AI assistant.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" align="center" sx={{ mb: 4, fontWeight: 'bold' }}>
            Subscription Plans
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <Card
                className="card"
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  borderRadius: '15px',
                  height: '100%',
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'scale(1.05)' },
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Student Plan
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    4-day free trial, 1 resume, 45 submissions/day.
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      mt: 2,
                      backgroundColor: '#00e676',
                      '&:hover': { backgroundColor: '#00c853' },
                    }}
                    onClick={() => handleSubscriptionClick('STUDENT')}
                    className="back-button"
                  >
                    Choose Student
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card
                className="card"
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  borderRadius: '15px',
                  height: '100%',
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'scale(1.05)' },
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Recruiter Plan
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    4-day free trial, 5 resumes, 45 submissions/day.
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      mt: 2,
                      backgroundColor: '#00e676',
                      '&:hover': { backgroundColor: '#00c853' },
                    }}
                    onClick={() => handleSubscriptionClick('RECRUITER')}
                    className="back-button"
                  >
                    Choose Recruiter
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card
                className="card"
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  borderRadius: '15px',
                  height: '100%',
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'scale(1.05)' },
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Business Plan
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    4-day free trial, 3 resumes, 145 submissions/day.
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      mt: 2,
                      backgroundColor: '#00e676',
                      '&:hover': { backgroundColor: '#00c853' },
                    }}
                    onClick={() => handleSubscriptionClick('BUSINESS')}
                    className="back-button"
                  >
                    Choose Business
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            ZvertexAI
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Empowering careers with AI-driven solutions.
          </Typography>
        </Box>
      </Container>

      <Box sx={{ py: 3, backgroundColor: '#1a2a44', textAlign: 'center' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Quick Links
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
          <Button
            color="inherit"
            onClick={() => alert('Why ZvertexAI page coming soon!')}
          >
            Why ZvertexAI?
          </Button>
          <Button
            color="inherit"
            onClick={() => alert('Interview FAQs page coming soon!')}
          >
            Interview FAQs
          </Button>
          <Button
            color="inherit"
            onClick={() => alert('ZOHA Copilot page coming soon!')}
          >
            ZOHA Copilot
          </Button>
          <Button
            color="inherit"
            onClick={() => alert('Contact Us page coming soon!')}
          >
            Contact Us
          </Button>
        </Box>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Address: 5900 BALCONES DR #16790 AUSTIN, TX 78731
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Phone: 737-239-0920
        </Typography>
        <Typography variant="body2">
          © 2025 ZvertexAI. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}

export default Home;