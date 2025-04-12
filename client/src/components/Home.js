import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useHistory } from 'react-router-dom';

function Home() {
  const history = useHistory();

  return (
    <Box sx={{
      minHeight: 'calc(100vh - 64px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      color: 'white',
    }}>
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Typography variant="h2" sx={{ fontWeight: 'bold', color: '#ffffff' }}>
            Welcome to ZvertexAI
          </Typography>
          <Typography variant="h5" sx={{ color: 'white', opacity: 0.9 }}>
            Your AI-powered career companion. Find jobs, get insights, and excel with ZGPT.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4 }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#ff6d00',
                '&:hover': { backgroundColor: '#e65100' },
                borderRadius: '25px',
                py: 1.5,
                px: 4,
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
              }}
              onClick={() => history.push('/dashboard')}
            >
              Explore Jobs
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderColor: '#00e676',
                color: '#00e676',
                '&:hover': { borderColor: '#00c853', color: '#00c853' },
                borderRadius: '25px',
                py: 1.5,
                px: 4,
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
              }}
              onClick={() => history.push('/zgpt')}
            >
              Try ZGPT
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Home;