import React from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Typography, Container, Button, Grid, Card, CardContent, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function ProjectSaas({ user }) {
  const history = useHistory();

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', color: 'white' }}>
      <Container maxWidth="lg">
        <IconButton onClick={() => history.goBack()} sx={{ color: '#ff6d00', mt: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" sx={{ mt: 4, mb: 4, textAlign: 'center', fontWeight: 'bold' }}>
          SaaS Solutions
        </Typography>
        <Typography variant="h6" sx={{ mb: 4, textAlign: 'center', opacity: 0.9 }}>
          Build scalable, AI-driven SaaS tools to empower businesses worldwide.
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Card sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '15px' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Use Case</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Our SaaS platform automates HR processes for small businesses, using AI to screen resumes, schedule interviews, and predict candidate fit, reducing hiring time by 50%.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '15px', height: '100%' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>For Clients</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Streamline your operations with our SaaS tools. Save costs and boost efficiency with AI-driven automation tailored to your needs.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '15px', height: '100%' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>For Users</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Join our team to develop SaaS solutions, gaining hands-on experience with AI, cloud, and scalable architectures.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            variant="contained"
            sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' }, borderRadius: '25px', px: 4, py: 1.5, mr: 2 }}
            onClick={() => history.push(user ? '/dashboard' : '/register')}
          >
            {user ? 'Join Project' : 'Subscribe Now'}
          </Button>
          <Button
            variant="text"
            sx={{ color: '#ff6d00' }}
            onClick={() => history.push('/contact')}
          >
            Contact Us to Join
          </Button>
        </Box>
      </Container>
      <Box sx={{ py: 3, backgroundColor: '#1a2a44', textAlign: 'center', mt: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ mb: 2 }}>Contact Us</Typography>
              <Typography variant="body2">
                Address: 5900 Balcones Dr #16790, Austin, TX 78731
              </Typography>
              <Typography variant="body2">
                Phone: (737) 239-0920
              </Typography>
              <Typography variant="body2">
                Email: support@zvertexai.com
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ mb: 2 }}>Quick Links</Typography>
              <Typography variant="body2" sx={{ cursor: 'pointer' }} onClick={() => history.push('/faq')}>
                Interview FAQs
              </Typography>
              <Typography variant="body2" sx={{ cursor: 'pointer' }} onClick={() => history.push('/why-us')}>
                Why ZvertexAI?
              </Typography>
              <Typography variant="body2" sx={{ cursor: 'pointer' }} onClick={() => history.push('/projects')}>
                Join Our Projects
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ mb: 2 }}>Follow Us</Typography>
              <Typography variant="body2">Twitter | LinkedIn | GitHub</Typography>
            </Grid>
          </Grid>
          <Typography variant="body2" sx={{ mt: 2 }}>
            © 2025 ZvertexAI. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default ProjectSaas;