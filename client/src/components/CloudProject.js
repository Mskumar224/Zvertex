import React from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Typography, Container, Button } from '@mui/material';

function CloudProject({ user }) {
  const history = useHistory();

  return (
    <Box sx={{
      minHeight: 'calc(100vh - 64px)',
      color: 'white',
    }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ffffff' }}>
            Cloud Computing
          </Typography>
          <Box sx={{
            background: 'rgba(255, 255, 255, 0.1)',
            p: 4,
            borderRadius: '15px',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
            textAlign: 'center',
            transition: 'all 0.3s ease',
          }}>
            <Typography variant="h6" sx={{ color: '#00e676', mb: 2 }}>
              Robust Cloud Infrastructure
            </Typography>
            <Typography variant="body1" sx={{ color: 'white', mb: 4 }}>
              We build scalable cloud solutions using AWS, Azure, and GCP to ensure high availability and performance.
            </Typography>
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
              onClick={() => history.push('/projects')}
            >
              View All Projects
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default CloudProject;