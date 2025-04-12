import React from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Typography, Container, Button } from '@mui/material';

function SaaSProject({ user }) {
  const history = useHistory();

  return (
    <Box sx={{
      minHeight: 'calc(100vh - 64px)',
      color: 'white',
    }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ffffff' }}>
            SaaS Solutions
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
              Scalable Software-as-a-Service
            </Typography>
            <Typography variant="body1" sx={{ color: 'white', mb: 4 }}>
              Our SaaS platforms empower businesses with flexible, cloud-based solutions tailored to their needs, from CRM to project management.
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

export default SaaSProject;