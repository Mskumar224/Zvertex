import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import BackButton from './BackButton';

function ContactUs({ user }) {
  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <BackButton />
          <Typography variant="h4" sx={{ color: 'white', flexGrow: 1, textAlign: 'center' }}>
            Contact Us
          </Typography>
        </Box>
        <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>
          Get in Touch
        </Typography>
        <Typography variant="body1" sx={{ color: 'white', mb: 4 }}>
          Reach out to us at zvertexai@honotech.com.
        </Typography>
      </Container>
    </Box>
  );
}

export default ContactUs;