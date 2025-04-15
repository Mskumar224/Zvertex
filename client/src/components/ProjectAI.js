import React from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Typography, Button, Container, Grid } from '@mui/material';

function ProjectAI({ user }) {
  const history = useHistory();

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', py: 8 }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h2" sx={{ color: 'white', mb: 2, fontWeight: 'bold' }}>
            AI Project
          </Typography>
          <Typography variant="h5" sx={{ color: 'white', mb: 4 }}>
            Build Intelligent Solutions
          </Typography>
          <Typography variant="body1" sx={{ color: 'white', mb: 4, maxWidth: '600px', mx: 'auto' }}>
            Develop AI-driven applications like ZGPT to enhance career planning and job matching.
          </Typography>
        </Box>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ backgroundColor: 'rgba(255,255,255,0.1)', p: 3, borderRadius: '15px' }}>
              <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                Project Scope
              </Typography>
              <Typography variant="body2" sx={{ color: 'white' }}>
                Create machine learning models for job recommendation and resume analysis.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ backgroundColor: 'rgba(255,255,255,0.1)', p: 3, borderRadius: '15px' }}>
              <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                Technologies
              </Typography>
              <Typography variant="body2" sx={{ color: 'white' }}>
                Python, TensorFlow, NLP, React for front-end integration.
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button
            variant="contained"
            sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' }, px: 4, py: 1.5 }}
            onClick={() => history.push('/dashboard')}
          >
            Join Project
          </Button>
        </Box>
        <Box sx={{ py: 6, mt: 8, backgroundColor: '#1a2a44', borderRadius: '15px' }}>
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              <Grid item xs={12} sm={4}>
                <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                  ZvertexAI
                </Typography>
                <Typography variant="body2" sx={{ color: 'white' }}>
                  Empowering careers with AI-driven solutions.
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                  Quick Links
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', mb: 1, cursor: 'pointer' }} onClick={() => history.push('/why-zvertexai')}>
                  Why ZvertexAI?
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', mb: 1, cursor: 'pointer' }} onClick={() => history.push('/interview-faqs')}>
                  Interview FAQs
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', mb: 1, cursor: 'pointer' }} onClick={() => history.push('/zgpt')}>
                  ZGPT Copilot
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                  Contact Us
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
                  Address: 5900 BALCONES DR #16790 AUSTIN, TX 78731
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
                  Phone: 737-239-0920
                </Typography>
                <Button
                  variant="outlined"
                  sx={{ color: 'white', borderColor: 'white' }}
                  onClick={() => history.push('/contact-us')}
                >
                  Reach Out
                </Button>
              </Grid>
            </Grid>
            <Typography variant="body2" align="center" sx={{ color: 'white', mt: 4 }}>
              © 2025 ZvertexAI. All rights reserved.
            </Typography>
          </Container>
        </Box>
      </Container>
    </Box>
  );
}

export default ProjectAI;