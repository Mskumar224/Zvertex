import React from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Typography, Button, Container, Grid, Divider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

function ProjectCloud() {
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
            Cloud Migration
          </Typography>
          <Box sx={{ maxWidth: '800px', mx: 'auto', mb: 6 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
              Use Case
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
              Our Cloud Migration project helps businesses and individuals transition to scalable, secure cloud environments. Whether it’s AWS, Azure, or Google Cloud, we optimize infrastructure for performance and cost, enabling seamless digital transformation.
            </Typography>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
              Why Join Us?
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              - <strong>For Clients:</strong> Reduce costs and boost efficiency with expertly managed cloud solutions tailored to your needs.
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              - <strong>For Users:</strong> Gain expertise in cloud technologies and contribute to real-world migration projects.
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
              Join us to scale your skills or business with the power of the cloud.
            </Typography>
            <Box sx={{ textAlign: 'center' }}>
              <Button 
                variant="contained" 
                sx={{ 
                  mr: 2,
                  backgroundColor: '#ff6d00', 
                  '&:hover': { backgroundColor: '#e65100' }, 
                  px: 4, 
                  py: 1.5 
                }} 
                onClick={() => history.push(user ? '/dashboard' : '/register')}
              >
                {user ? 'Get Started' : 'Subscribe Now'}
              </Button>
              <Button 
                variant="outlined" 
                sx={{ 
                  color: '#ff6d00', 
                  borderColor: '#ff6d00', 
                  px: 4, 
                  py: 1.5 
                }} 
                onClick={() => history.push('/contact')}
              >
                Contact Us to Join
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

export default ProjectCloud;