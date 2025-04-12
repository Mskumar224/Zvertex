import React from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Typography, Button, Container, IconButton, Grid } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function DevOps({ user }) {
  const history = useHistory();

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', color: 'white' }}>
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, mb: 8 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <IconButton onClick={() => history.goBack()} sx={{ color: '#ff6d00' }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
              DevOps Integration
            </Typography>
          </Box>
          <Typography variant="h5" sx={{ mb: 4 }}>
            Streamline Development with ZvertexAI
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '15px', p: 3, height: '100%' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Use Case for Clients
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Implement CI/CD pipelines, containerization, and monitoring with our DevOps expertise. Ensure faster releases and robust infrastructure.
                </Typography>
                <Typography variant="body2">
                  <strong>Why Join Us?</strong> Accelerate delivery, improve system reliability, and reduce costs with our tailored DevOps solutions.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '15px', p: 3, height: '100%' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Use Case for Users
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Master DevOps tools like Docker, Jenkins, and Ansible. Contribute to projects that enhance deployment efficiency and scalability.
                </Typography>
                <Typography variant="body2">
                  <strong>Why Join Us?</strong> Build in-demand DevOps skills, work on enterprise-grade systems, and advance your career in tech.
                </Typography>
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button 
              variant="contained" 
              sx={{ 
                backgroundColor: '#ff6d00', 
                '&:hover': { backgroundColor: '#e65100' },
                borderRadius: '25px',
                px: 4,
                py: 1.5
              }}
              onClick={() => history.push(user ? '/contact' : '/register')}
            >
              Contact Us to Join
            </Button>
          </Box>
        </Box>
      </Container>
      <Box sx={{ py: 4, backgroundColor: '#1a2a44', color: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>About ZvertexAI</Typography>
              <Typography variant="body2">
                ZvertexAI empowers your career with AI-driven job matching, innovative projects, and ZGPT, your personal copilot. Join us to shape the future!
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Quick Links</Typography>
              <Box>
                <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer' }} onClick={() => history.push('/faq')}>
                  Interview FAQs
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer' }} onClick={() => history.push('/why-us')}>
                  Why ZvertexAI?
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer' }} onClick={() => history.push('/zgpt')}>
                  ZGPT Copilot
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer' }} onClick={() => history.push('/contact')}>
                  Contact Us
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Contact Us</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Address: 5900 Balcones Dr #16790, Austin, TX 78731
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Phone: (737) 239-0920
              </Typography>
              <Typography variant="body2">
                Email: support@zvertexai.com
              </Typography>
            </Grid>
          </Grid>
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2">
              © 2025 ZvertexAI. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default DevOps;