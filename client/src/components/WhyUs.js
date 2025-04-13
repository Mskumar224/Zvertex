import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Grid,
  Button,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MenuIcon from '@mui/icons-material/Menu';

function WhyUs({ user, setSidebarOpen }) {
  const history = useHistory();

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#121212', color: 'white', py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <IconButton
            onClick={() => history.push('/')}
            sx={{ color: 'white', mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          {user && (
            <IconButton
              onClick={() => setSidebarOpen(true)}
              sx={{ color: 'white' }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Box>
        <Typography variant="h4" sx={{ mb: 4, textAlign: 'center', fontWeight: 'bold' }}>
          Why Choose ZvertexAI?
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              AI-Powered Job Matching
            </Typography>
            <Typography variant="body1">
              Our advanced AI matches your skills to the best job opportunities across 60+ technologies.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Automation
            </Typography>
            <Typography variant="body1">
              Auto-apply to jobs every 30 minutes, saving you time and effort.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Hands-On Projects
            </Typography>
            <Typography variant="body1">
              Build real-world experience with SaaS, Cloud, AI, Big Data, and DevOps projects.
            </Typography>
          </Grid>
          <Grid item xs={12} sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              variant="contained"
              onClick={() => history.push(user ? '/dashboard' : '/register')}
              sx={{
                backgroundColor: '#ff6d00',
                '&:hover': { backgroundColor: '#e65100' },
                borderRadius: '25px',
                px: 4,
                py: 1.5,
              }}
            >
              {user ? 'Go to Dashboard' : 'Get Started'}
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default WhyUs;