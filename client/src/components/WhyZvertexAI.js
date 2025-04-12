import React from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Typography, Container, Grid, Card, CardContent, Button } from '@mui/material';

function WhyZvertexAI() {
  const history = useHistory();

  const benefits = [
    {
      title: 'AI-Driven Job Matching',
      description: 'Our AI analyzes your resume to match you with top jobs at companies like Google and Amazon, automating applications to save you time.'
    },
    {
      title: 'Innovative Projects',
      description: 'Join our SaaS, AI, Cloud, Big Data, and DevOps projects to work on cutting-edge solutions with industry experts.'
    },
    {
      title: 'ZGPT Copilot',
      description: 'Get real-time assistance from ZGPT for interview prep, resume building, and career advice, all tailored to your goals.'
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', color: 'white' }}>
      <Container maxWidth="lg">
        <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Button
            variant="text"
            sx={{ mb: 2, color: '#00e676', alignSelf: 'flex-start' }}
            onClick={() => history.push('/')}
          >
            Back to Home
          </Button>
          <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: '#ff6d00' }}>
            Why Choose ZvertexAI?
          </Typography>
          <Grid container spacing={4}>
            {benefits.map((benefit, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <Card
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    borderRadius: '15px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                    height: '100%',
                    transition: 'transform 0.3s',
                    '&:hover': { transform: 'scale(1.05)' },
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                      {benefit.title}
                    </Typography>
                    <Typography variant="body2">
                      {benefit.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Button
            variant="contained"
            sx={{
              mt: 6,
              backgroundColor: '#ff6d00',
              '&:hover': { backgroundColor: '#e65100' },
              borderRadius: '25px',
              py: 1.5,
              px: 4,
            }}
            onClick={() => history.push('/register')}
          >
            Get Started Now
          </Button>
        </Box>
      </Container>
      <Box sx={{
        py: 4,
        backgroundColor: '#1a2a44',
        color: 'white',
        textAlign: 'center',
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                About ZvertexAI
              </Typography>
              <Typography variant="body2">
                Empowering careers with AI-driven job matching, innovative projects, and ZGPT copilot.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Quick Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button color="inherit" onClick={() => history.push('/faq')}>Interview FAQs</Button>
                <Button color="inherit" onClick={() => history.push('/why-us')}>Why ZvertexAI?</Button>
                <Button color="inherit" onClick={() => history.push('/projects')}>Our Projects</Button>
                <Button color="inherit" onClick={() => history.push('/contact-us')}>Contact Us</Button>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Contact Info
              </Typography>
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
          <Typography variant="body2" sx={{ mt: 4 }}>
            © 2025 ZvertexAI. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default WhyZvertexAI;