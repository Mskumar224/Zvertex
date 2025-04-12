import React from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Typography, Button, Container, IconButton, Grid, Card, CardContent } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function WhyZvertexAI({ user }) {
  const history = useHistory();

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', color: 'white' }}>
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, mb: 8 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <IconButton onClick={() => history.goBack()} sx={{ color: '#ff6d00' }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
              Why ZvertexAI?
            </Typography>
          </Box>
          <Typography variant="h5" sx={{ mb: 4 }}>
            Your Gateway to a Future-Ready Career
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            At ZvertexAI, our vision is to empower individuals and businesses with AI-driven solutions that redefine career growth and innovation. 
            We aim to be the leading platform for job seekers and companies by 2030, leveraging AI to match talent with opportunities and fostering collaboration on transformative projects.
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <Card sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '15px', height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>AI-Powered Job Matching</Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Our advanced AI analyzes your skills and preferences to connect you with the perfect job. Subscribe for unlimited applications and personalized insights.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '15px', height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Innovative Projects</Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Join our AI, Cloud, and SaaS projects to work on cutting-edge technologies. Contribute to solutions that shape industries and build your portfolio.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '15px', height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>ZGPT Copilot</Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Your personal AI assistant, ZGPT, guides you through career decisions and technical challenges. Try it free for 7 days with any subscription!
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Join us to unlock a world of opportunities. Start your journey today!
            </Typography>
            <Button 
              variant="contained" 
              sx={{ 
                backgroundColor: '#ff6d00', 
                '&:hover': { backgroundColor: '#e65100' },
                borderRadius: '25px',
                px: 4,
                py: 1.5
              }}
              onClick={() => history.push(user ? '/dashboard' : '/register')}
            >
              {user ? 'Explore Now' : 'Start Free Trial'}
            </Button>
          </Box>
        </Box>
      </Container>
      <Box sx={{ py: 4, backgroundColor: '#1a2a44', color: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>About ZvertexAI</Typography>
              <Typography variant="body2">
                ZvertexAI empowers your career with AI-driven job matching, innovative projects, and ZGPT, your personal copilot. Join us to shape the future!
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Quick Links</Typography>
              <Box>
                <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer' }} onClick={() => history.push('/faq')}>
                  Interview FAQs
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer' }} onClick={() => history.push('/why-us')}>
                  Why ZvertexAI?
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer' }} onClick={() => history.push('/zgpt')}>
                  ZGPT Copilot
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer' }} onClick={() => history.push('/contact')}>
                  Contact Us
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Contact Us</Typography>
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
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2">
              © 2025 ZvertexAI. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default WhyZvertexAI;