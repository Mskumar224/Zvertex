import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import BackButton from './BackButton';

function WhyZvertexAI({ user }) {
  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <BackButton />
          <Typography variant="h4" sx={{ color: 'white', flexGrow: 1, textAlign: 'center' }}>
            Why ZvertexAI
          </Typography>
        </Box>
        <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>
          Our Mission
        </Typography>
        <Typography variant="body1" sx={{ color: 'white', mb: 4 }}>
          ZvertexAI leverages AI to empower job seekers with tools for career growth.
        </Typography>
      </Container>
    </Box>
  );
}

export default WhyZvertexAI;