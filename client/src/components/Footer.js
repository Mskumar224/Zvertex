import React from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Container, Grid, Typography, Button } from '@mui/material';

function Footer() {
  const history = useHistory();

  return (
    <Box sx={{
      py: 4,
      background: 'rgba(26, 42, 68, 0.9)',
      backdropFilter: 'blur(10px)',
      color: 'white',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      mt: 'auto',
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
              <Button
                sx={{ color: '#00e676', textTransform: 'none', justifyContent: 'flex-start' }}
                onClick={() => history.push('/faq')}
              >
                Interview FAQs
              </Button>
              <Button
                sx={{ color: '#00e676', textTransform: 'none', justifyContent: 'flex-start' }}
                onClick={() => history.push('/why-us')}
              >
                Why ZvertexAI?
              </Button>
              <Button
                sx={{ color: '#00e676', textTransform: 'none', justifyContent: 'flex-start' }}
                onClick={() => history.push('/projects')}
              >
                Our Projects
              </Button>
              <Button
                sx={{ color: '#00e676', textTransform: 'none', justifyContent: 'flex-start' }}
                onClick={() => history.push('/contact-us')}
              >
                Contact Us
              </Button>
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
        <Typography variant="body2" sx={{ mt: 4, textAlign: 'center', color: 'white' }}>
          © 2025 ZvertexAI. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;