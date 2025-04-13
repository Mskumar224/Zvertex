import React from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Typography, Container, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function ProjectSaaS({ user }) {
  const history = useHistory();

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={() => history.goBack()} sx={{ color: 'white' }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ color: 'white', flexGrow: 1, textAlign: 'center' }}>
            SaaS Project
          </Typography>
        </Box>
        <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>
          Explore SaaS Solutions
        </Typography>
        <Typography variant="body1" sx={{ color: 'white', mb: 4 }}>
          Learn about our SaaS offerings for career growth and job matching.
        </Typography>
      </Container>
    </Box>
  );
}

export default ProjectSaaS;