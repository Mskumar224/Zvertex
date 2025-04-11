import React from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Typography, Button, Container, Grid, Divider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

function WhyZvertexAI() {
  const history = useHistory();
  const user = localStorage.getItem('token') ? true : false;

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#121212', color: 'white' }}>
      <Container maxWidth="lg">
        <Box sx={{ py: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => history.goBack()}
            sx={{ color: '#ff6d00', mb: 2 }}
          >
            Back
          </Button>
          <Typography variant="h4" sx={{ mb: 4, textAlign: 'center', fontWeight: 'bold' }}>
            Why ZvertexAI?
          </Typography>
          <Box sx={{ maxWidth: '800px', mx: 'auto', mb: 6 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
              Our Vision
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
              At ZvertexAI, we envision a world where technology empowers every individual to achieve their career dreams. By harnessing the power of AI, we aim to bridge the gap between talent and opportunity, making job searching smarter, faster, and more personalized.
            </Typography>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
              Our Goals
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              - <strong>Revolutionize Job Matching:</strong> Use AI to match you with jobs that align with your skills and aspirations.
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              - <strong>Drive Innovation:</strong> Build cutting-edge AI, Cloud, and SaaS solutions through our in-house projects.
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
              - <strong>Empower with ZGPT:</strong> Provide a personal AI copilot to guide you through your career journey.
            </Typography>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
              Why Join Us?
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              - <strong>Unmatched Opportunities:</strong> Access exclusive job listings and projects that you won’t find anywhere else.
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              - <strong>Career Growth:</strong> Leverage our tools to upskill, apply smarter, and land your dream job.
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
              - <strong>Community Impact:</strong> Be part of a movement that’s shaping the future of work with AI.
            </Typography>
            <Box sx={{ textAlign: 'center' }}>
              <Button 
                variant="contained" 
                sx={{ 
                  backgroundColor: '#ff6d00', 
                  '&:hover': { backgroundColor: '#e65100' }, 
                  px: 4, 
                  py: 1.5 
                }} 
                onClick={() => history.push(user ? '/dashboard' : '/register')}
              >
                {user ? 'Explore Now' : 'Subscribe Now'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>

      <Box sx={{ py: 4, backgroundColor: '#1a2a44', color: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                About ZvertexAI
              </Typography>
              <Typography variant="body2">
                ZvertexAI empowers careers with AI-driven job matching, innovative projects, and ZGPT, your personal copilot. Join us to shape the future of technology.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Quick Links
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer' }} onClick={() => history.push('/why-zvertexai')}>
                Why ZvertexAI?
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer' }} onClick={() => history.push('/interview-faqs')}>
                Interview FAQs
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer' }} onClick={() => history.push('/zgpt')}>
                ZGPT Copilot
              </Typography>
              <Typography variant="body2" sx={{ cursor: 'pointer' }} onClick={() => history.push('/contact')}>
                Contact Us
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Contact Us
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocationOnIcon sx={{ mr: 1 }} />
                <Typography variant="body2">
                  5900 Balcones Dr #16790, Austin, TX 78731
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PhoneIcon sx={{ mr: 1 }} />
                <Typography variant="body2">
                  (737) 239-0920
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <EmailIcon sx={{ mr: 1 }} />
                <Typography variant="body2" sx={{ cursor: 'pointer' }} onClick={() => history.push('/contact')}>
                  contact@zvertexai.com
                </Typography>
              </Box>
              <Button 
                variant="contained" 
                sx={{ mt: 2, backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' } }} 
                onClick={() => history.push('/register')}
              >
                Subscribe Now
              </Button>
            </Grid>
          </Grid>
          <Divider sx={{ my: 3, backgroundColor: 'rgba(255,255,255,0.2)' }} />
          <Typography variant="body2" align="center">
            © 2025 ZvertexAI. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default WhyZvertexAI;