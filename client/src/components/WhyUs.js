import React from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Typography, Button, Container, Grid, Card, CardContent, Divider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function WhyUs() {
  const history = useHistory();

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', color: 'white' }}>
      <Container maxWidth="lg">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => history.goBack()}
          sx={{ mt: 2, color: '#ff6d00' }}
        >
          Back
        </Button>
        <Typography variant="h4" sx={{ mt: 4, mb: 4, fontWeight: 'bold', textAlign: 'center' }}>
          Why ZvertexAI?
        </Typography>
        <Typography variant="h6" sx={{ mb: 4, textAlign: 'center', opacity: 0.9 }}>
          Our vision is to revolutionize careers and businesses with cutting-edge AI solutions.
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '15px', height: '100%' }}>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>Our Vision</Typography>
                <Typography variant="body1">
                  At ZvertexAI, we aim to empower every individual and organization with AI-driven tools that simplify job searches, 
                  enhance productivity, and foster innovation. Our goal is to be the go-to platform for career growth and tech solutions by 2030.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '15px', height: '100%' }}>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>Our Goals</Typography>
                <Typography variant="body1">
                  - Provide AI-powered job matching for seamless career transitions.<br/>
                  - Develop in-house projects that solve real-world problems.<br/>
                  - Offer ZGPT as your personal AI copilot for daily tasks.<br/>
                  - Build a community of innovators and professionals.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card sx={{ backgroundColor: '#212121', color: 'white', borderRadius: '15px', p: 3 }}>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>Why Join Us?</Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  Whether you're a job seeker looking for your dream role or a business aiming to leverage AI, ZvertexAI offers unparalleled 
                  opportunities. Subscribe today to unlock premium features like unlimited job applications, exclusive project access, 
                  and personalized AI assistance with ZGPT.
                </Typography>
                <Button 
                  variant="contained" 
                  sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' }, borderRadius: '25px' }} 
                  onClick={() => history.push('/register')}
                >
                  Subscribe Now
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <Box sx={{ py: 4, backgroundColor: '#1a2a44', textAlign: 'center', mt: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>ZvertexAI</Typography>
              <Typography variant="body2">
                Empowering careers and businesses with AI-driven solutions.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Quick Links</Typography>
              <Typography variant="body2" sx={{ cursor: 'pointer' }} onClick={() => history.push('/contact')}>
                Contact Us
              </Typography>
              <Typography variant="body2" sx={{ cursor: 'pointer' }} onClick={() => history.push('/faq')}>
                Interview FAQs
              </Typography>
              <Typography variant="body2" sx={{ cursor: 'pointer' }} onClick={() => history.push('/why-us')}>
                Why ZvertexAI?
              </Typography>
              <Typography variant="body2" sx={{ cursor: 'pointer' }} onClick={() => history.push('/zgpt')}>
                ZGPT Copilot
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Contact</Typography>
              <Typography variant="body2">5900 Balcones Dr #16790, Austin, TX 78731</Typography>
              <Typography variant="body2">Phone: 737-239-0920 (151)</Typography>
              <Typography variant="body2">Email: support@zvertexai.com</Typography>
            </Grid>
          </Grid>
          <Divider sx={{ my: 2, backgroundColor: '#fff' }} />
          <Typography variant="body2">
            © 2025 ZvertexAI. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default WhyUs;