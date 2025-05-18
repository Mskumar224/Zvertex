import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <Container sx={{ py: 8, textAlign: 'center', background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)', minHeight: '100vh' }}>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          Welcome to ZvertexAGI
        </Typography>
        <Typography variant="h6" sx={{ maxWidth: 600, mx: 'auto', color: '#424242' }}>
          Unlock your career potential with ZvertexAGI – the ultimate AI-powered job application platform. Upload your resume, choose a tailored subscription, and let us auto-apply to top-tier opportunities while you focus on what matters most.
        </Typography>
      </Box>
      <Button variant="contained" color="primary" component={Link} to="/signup" sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}>
        Start Your Journey
      </Button>
    </Container>
  );
}

export default Home;