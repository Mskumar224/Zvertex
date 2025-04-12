import React from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Typography, Button, Container, IconButton, Grid } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function AIJobMatching({ user }) {
  const history = useHistory();

  if (!user) {
    history.push('/register');
    return null;
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', color: 'white' }}>
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, mb: 8 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <IconButton onClick={() => history.goBack()} sx={{ color: '#ff6d00' }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
              AI Job Matching
            </Typography>
          </Box>
          <Typography variant="h5" sx={{ mb: 4 }}>
            Unlock Your Career Potential with ZvertexAI
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '15px', p: 3, height: '100%' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Use Case for Clients
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Our AI Job Matching service streamlines hiring by analyzing resumes and matching candidates to your job requirements with precision. 
                  Save time and find top talent effortlessly.
                </Typography>
                <Typography variant="body2">
                  <strong>Why Join Us?</strong> Reduce recruitment costs, access a curated talent pool, and leverage AI for unbiased hiring decisions.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '15px', p: 3, height: '100%' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Use Case for Users
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Upload your resume and let our AI match you with jobs tailored to your skills and preferences. 
                  Automate applications and receive personalized job recommendations.
                </Typography>
                <Typography variant="body2">
                  <strong>Why Join Us?</strong> Land your dream job faster with AI-driven insights, unlimited applications, and real-time job alerts.
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
              onClick={() => history.push('/contact')}
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
拆掉：
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

export default AIJobMatching;