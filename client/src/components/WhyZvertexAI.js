import React from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Typography, Button, Container, Grid, Card, CardContent, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function WhyZvertexAI({ user }) {
  const history = useHistory();

  const reasons = [
    {
      title: 'AI-Driven Job Matching',
      description: 'Our advanced AI analyzes your resume to match you with the best job opportunities, automating applications to save you time.',
    },
    {
      title: 'Innovative Projects',
      description: 'Join our AI, Cloud, and SaaS projects to work on cutting-edge technologies and build your portfolio.',
    },
    {
      title: 'ZGPT Copilot',
      description: 'Get personalized career advice and insights from ZGPT, your AI-powered assistant, available 24/7.',
    },
    {
      title: 'Community and Growth',
      description: 'Be part of a thriving community of professionals and students, with resources to grow your skills and network.',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={() => history.goBack()} sx={{ color: 'white' }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ color: 'white', flexGrow: 1, textAlign: 'center' }}>
            Why ZvertexAI?
          </Typography>
        </Box>
        <Typography variant="h5" sx={{ color: 'white', mb: 4, textAlign: 'center' }}>
          Our Vision: Empowering Careers with Artificial Intelligence
        </Typography>
        <Typography variant="body1" sx={{ color: 'white', mb: 4, textAlign: 'center' }}>
          At ZvertexAI, we aim to revolutionize the job market by combining AI automation with human ambition. Whether you're a student, recruiter, or business, we provide tools to succeed in a competitive world.
        </Typography>
        <Grid container spacing={4}>
          {reasons.map((reason, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Card sx={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                color: 'white',
                borderRadius: '15px',
                transition: 'transform 0.3s',
                '&:hover': { transform: 'scale(1.05)' },
              }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{reason.title}</Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>{reason.description}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
            Ready to Transform Your Career?
          </Typography>
          <Button
            variant="contained"
            sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' } }}
            onClick={() => history.push(user ? '/dashboard' : '/register')}
          >
            {user ? 'Go to Dashboard' : 'Subscribe Now'}
          </Button>
        </Box>
        <Box sx={{ py: 4, backgroundColor: '#1a2a44', color: 'white', mt: 4 }}>
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              <Grid item xs={12} sm={4}>
                <Typography variant="h6" sx={{ mb: 2 }}>ZvertexAI</Typography>
                <Typography variant="body2">
                  Empowering careers with AI-driven job matching, projects, and ZGPT copilot.
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="h6" sx={{ mb: 2 }}>Quick Links</Typography>
                <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer' }} onClick={() => history.push('/why-zvertexai')}>
                  Why ZvertexAI?
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer' }} onClick={() => history.push('/interview-faqs')}>
                  Interview FAQs
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

export default WhyZvertexAI;