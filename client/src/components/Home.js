import React from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Typography, Button, Container, Grid } from '@mui/material';

function Home() {
  const history = useHistory();

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)',
      color: 'white',
      py: 8,
    }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ff6d00' }}>
            Welcome to ZvertexAI
          </Typography>
          <Typography variant="body1" sx={{ color: '#00e676', maxWidth: '600px', mx: 'auto' }}>
            Your AI-powered career copilot for job matching, innovative projects, and interview prep.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#ff6d00',
                '&:hover': { backgroundColor: '#e65100' },
                borderRadius: '25px',
                py: 1.5,
                px: 4,
                fontWeight: 'bold',
              }}
              onClick={() => history.push('/register')}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              sx={{
                color: '#00e676',
                borderColor: '#00e676',
                borderRadius: '25px',
                py: 1.5,
                px: 4,
                '&:hover': { borderColor: '#00c853', backgroundColor: 'rgba(0,230,118,0.1)' },
              }}
              onClick={() => history.push('/why-us')}
            >
              Learn More
            </Button>
          </Box>
        </Box>
        <Box sx={{ mt: 8 }}>
          <Typography variant="h6" sx={{ mb: 4, fontWeight: 'bold', color: '#ff6d00' }}>
            Why Choose ZvertexAI?
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <Box sx={{
                p: 3,
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: '15px',
                boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                textAlign: 'center',
              }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#00e676' }}>
                  Job Matching
                </Typography>
                <Typography variant="body2" sx={{ color: 'white' }}>
                  AI-driven resume analysis to connect you with top opportunities.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{
                p: 3,
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: '15px',
                boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                textAlign: 'center',
              }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#00e676' }}>
                  Innovative Projects
                </Typography>
                <Typography variant="body2" sx={{ color: 'white' }}>
                  Work on cutting-edge SaaS, AI, Cloud, and DevOps solutions.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{
                p: 3,
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: '15px',
                boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                textAlign: 'center',
              }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#00e676' }}>
                  ZGPT Copilot
                </Typography>
                <Typography variant="body2" sx={{ color: 'white' }}>
                  Real-time AI assistance for interviews and career planning.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
      <Box sx={{
        py: 4,
        mt: 8,
        backgroundColor: '#1a2a44',
        color: 'white',
        textAlign: 'center',
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#ff6d00' }}>
                About ZvertexAI
              </Typography>
              <Typography variant="body2" sx={{ color: 'white' }}>
                Empowering careers with AI-driven job matching and ZGPT copilot.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#ff6d00' }}>
                Quick Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button sx={{ color: '#00e676' }} onClick={() => history.push('/faq')}>Interview FAQs</Button>
                <Button sx={{ color: '#00e676' }} onClick={() => history.push('/why-us')}>Why ZvertexAI?</Button>
                <Button sx={{ color: '#00e676' }} onClick={() => history.push('/projects')}>Our Projects</Button>
                <Button sx={{ color: '#00e676' }} onClick={() => history.push('/contact-us')}>Contact Us</Button>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#ff6d00' }}>
                Contact Info
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, color: 'white' }}>
                Address: 5900 Balcones Dr #16790, Austin, TX 78731
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, color: 'white' }}>
                Phone: (737) 239-0920
              </Typography>
              <Typography variant="body2" sx={{ color: 'white' }}>
                Email: support@zvertexai.com
              </Typography>
            </Grid>
          </Grid>
          <Typography variant="body2" sx={{ mt: 4, color: 'white' }}>
            © 2025 ZvertexAI. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default Home;