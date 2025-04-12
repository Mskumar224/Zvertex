import React from 'react';
import { Box, Typography, Container, Grid } from '@mui/material';

function WhyZvertexAI() {
  const features = [
    {
      title: 'AI Job Matching',
      description: 'Find roles tailored to your skills with our advanced algorithms.',
    },
    {
      title: 'ZGPT Copilot',
      description: 'Get real-time guidance for interviews, resumes, and career planning.',
    },
    {
      title: 'Premium Support',
      description: 'Access exclusive resources and priority assistance.',
    },
  ];

  return (
    <Box sx={{
      minHeight: 'calc(100vh - 64px)',
      color: 'white',
    }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ffffff' }}>
            Why ZvertexAI?
          </Typography>
          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <Box sx={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  p: 3,
                  borderRadius: '10px',
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': { transform: 'translateY(-5px)' },
                }}>
                  <Typography variant="h6" sx={{ color: '#00e676', mb: 2 }}>
                    {feature.title}
                  </Typography>
                  <Typography sx={{ color: 'white', opacity: 0.9 }}>
                    {feature.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

export default WhyZvertexAI;